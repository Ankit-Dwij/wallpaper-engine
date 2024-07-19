const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const sqs = new AWS.SQS();
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const simplifiedColorMap = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  grey: "#808080",
  brown: "#A52A2A",
  pink: "#FFC0CB",
  teal: "#008080",
};

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const PREVIEW_BUCKET = process.env.PREVIEW_BUCKET;
const MAX_WIDTH = 400; // Max width for preview image

module.exports.processImage = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    const { Body: imageBuffer } = await s3.getObject(params).promise();

    // Save original image to /tmp
    const tempInputPath = `/tmp/${path.basename(key)}`;
    fs.writeFileSync(tempInputPath, imageBuffer);

    // Create preview image
    const tempOutputPath = `/tmp/preview_${path.basename(key)}`;
    await createPreviewImage(tempInputPath, tempOutputPath);

    // Upload preview to S3
    const previewKey = `preview_${key}`;
    await uploadToS3(PREVIEW_BUCKET, previewKey, tempOutputPath);

    // Process with Rekognition
    const rekognitionParams = {
      Image: {
        Bytes: imageBuffer,
      },
      Features: ["GENERAL_LABELS", "IMAGE_PROPERTIES"],
      MaxLabels: 10,
      MinConfidence: 70,
    };

    const rekognitionData = await rekognition
      .detectLabels(rekognitionParams)
      .promise();

    const labels = rekognitionData.Labels.map((label) => label.Name);
    const imageProperties = rekognitionData.ImageProperties;

    const colorPercentages = (imageProperties?.DominantColors || []).reduce(
      (acc, color) => {
        const simplifiedColor = color.DominantColorName.toLowerCase();
        if (!acc[simplifiedColor]) {
          acc[simplifiedColor] = 0;
        }
        acc[simplifiedColor] += color.PixelPercent;
        return acc;
      },
      {}
    );

    const significantColorHexCodes = Object.entries(colorPercentages)
      .filter(([_, percentage]) => percentage >= 15)
      .map(([color, _]) => simplifiedColorMap[color])
      .filter(Boolean);

    const result = {
      imageKey: key,
      previewKey: previewKey,
      labels,
      significantColorHexCodes,
    };

    // Publish the result to SQS
    await publishToSQS(result);

    console.log("Image processing result:", result);

    // Clean up temp files
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing the image" }),
    };
  }
};

async function createPreviewImage(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-vf",
      `scale='min(${MAX_WIDTH},iw)':'-1'`,
      outputPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}

async function uploadToS3(bucket, key, filePath) {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
  };
  await s3.putObject(params).promise();
}

async function publishToSQS(message) {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: SQS_QUEUE_URL,
  };

  try {
    const result = await sqs.sendMessage(params).promise();
    console.log("Message sent to SQS. MessageId:", result.MessageId);
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    throw error;
  }
}
