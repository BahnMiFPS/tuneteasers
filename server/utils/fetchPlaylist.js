const { getAccessToken, isAccessTokenExpired } = require("./spotify");
const axios = require("axios");
require("dotenv").config();

async function getPlaylistTracks(playlist_id) {
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}`;
  const token = await getAccessToken();

  // You will need to replace 'Bearer ' with your own token.
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching playlist tracks: ${error.message}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request);
    }
    return null;
  }
}

async function getPlayListByCountry(country, locale, token) {
  const url = `https://api.spotify.com/v1/browse/featured-playlists/?country=${country}&locale=${locale}&limit=50&timestamp=2023-06-03T20%3A00%3A00`;

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await axios.get(url, { headers });

    return response.data;
  } catch (error) {
    console.error("Playlist Fetching Error:", error);
    return null;
  }
}

module.exports = {
  getPlaylistTracks,
  getPlayListByCountry,
};
