const axios = require("axios");
const fs = require("fs");

const scrapePexels = async (query) => {
  const results = [];

  for (let page = 1; page <= 20; page++) {
    console.log(`Category: ${query} , page:${page}`);
    const url = `https://www.pexels.com/en-us/api/v3/search/photos?page=${page}&per_page=24&query=${query}&orientation=portrait&size=all&color=all&sort=popular&seo_tags=true`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          "Secret-Key": "H2jk9uKnhRmL6WPwh89zBezWvr",
        },
      });

      const photos = data.data;

      photos.forEach((photo) => {
        results.push({
          download_link: photo.attributes.image.download_link,
          category: query,
          title: photo.attributes.title,
        });
      });
    } catch (error) {
      console.error(`Error fetching data from page ${page}: ${error}`);
    }
  }

  return results;
};

// Scrape photos with different queries and save results to a JSON file
const queries = ["nature", "flower", "animals"];

const scrapeAll = async () => {
  let allResults = [];

  for (const query of queries) {
    const results = await scrapePexels(query);
    allResults = allResults.concat(results);
  }

  // Write results to a JSON file
  fs.writeFile(
    "pexels_photos.json",
    JSON.stringify(allResults, null, 2),
    (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Data successfully written to pexels_photos.json");
      }
    }
  );
};

scrapeAll();
