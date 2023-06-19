const { getAccessToken } = require("./spotify")
const axios = require("axios")
require("dotenv").config()

async function getPlaylistTracks(playlist_id) {
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}`
  const token = await getAccessToken()

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    console.error(`Error fetching playlist tracks: ${error.message}`)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data)
      console.error(error.response.status)
      console.error(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request)
    }
    return null
  }
}

async function getCategoriesByCountry(country, token) {
  let locale
  switch (country) {
    case "US":
      locale = "en_US"
      break
    case "KR":
      locale = "ko_KR"
      break
    default:
      locale = "vi_VN"
      break
  }
  const url = `https://api.spotify.com/v1/browse/categories?country=${country}&locale=${locale}&limit=50`
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    console.error("Get Categories By Country Error:", error)
    return null
  }
}
async function getPlayListByCategories(id, country, token) {
  console.log(id)
  // https://api.spotify.com/v1/browse/categories/toplists/playlists?country=VN
  const url = `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=${country}`
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const response = await axios.get(url, { headers })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Get Playlist By Country Error:", error)
    return null
  }
}
module.exports = {
  getPlaylistTracks,
  getPlayListByCategories,
  getCategoriesByCountry,
}
