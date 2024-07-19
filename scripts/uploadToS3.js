const fs = require("fs");
const axios = require("axios");
const AWS = require("aws-sdk");
const path = require("path");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.S3_BUCKET_NAME;
const jsonFilePath = "pexels_photos.json";

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.DB_COLLECTION_NAME;

const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

function uploadFileToS3(filepath, bucketName, key) {
  const fileContent = fs.readFileSync(filepath);
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };
  return s3.upload(params).promise();
}

function getFileExtension(url) {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  return pathname.split(".").pop();
}

async function processItem(item, db, collection) {
  const downloadLink = item.download_link;
  const fileExtension = getFileExtension(downloadLink);
  const fileName =
    "wallpaper-x-" + uuidv4().replace(/-/g, "") + `.${fileExtension}`;
  const localFilePath = path.join(process.cwd(), fileName);

  try {
    await downloadImage(downloadLink, localFilePath);
    console.log(`Downloaded ${fileName}`);

    const s3Key = `${item.category}/${fileName}`;
    await uploadFileToS3(localFilePath, bucketName, s3Key);
    console.log(`Uploaded ${fileName} to S3`);

    const s3Url = `https://${bucketName}.s3.${s3.config.region}.amazonaws.com/${s3Key}`;

    await collection.insertOne({
      download_link: s3Url,
      category: item.category,
      title: item.title,
    });
    console.log("Data saved to MongoDB:", {
      download_link: s3Url,
      category: item.category,
      title: item.title,
    });

    await unlinkAsync(localFilePath);
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
  }
}

async function processAndUpload() {
  const jsonData = JSON.parse(await readFileAsync(jsonFilePath, "utf8"));
  const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const PQueue = await import("p-queue");
    const queue = new PQueue.default({ concurrency: 10 });

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const tasks = jsonData.map(
      (item) => () => processItem(item, db, collection)
    );
    await queue.addAll(tasks);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

processAndUpload();
