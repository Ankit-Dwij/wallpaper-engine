import axios from "axios";

const serverUrl = `http://192.168.1.18:5000/v1`;

const getWallpaperByCategory = async (category, limit = 10, page = 1) => {
  let url = `${serverUrl}/wallpapers?category=${category}&limit=${limit}&page=${page}`;
  try {
    let res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log(JSON.stringify(err));
  }
};

export const apiCalls = { getWallpaperByCategory };
