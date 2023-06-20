const axios = require("axios")

require("dotenv").config()

let accessToken = null
let tokenExpiration = null
let refreshingTokenRequest = null

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_ID
  const clientSecret = process.env.SPOTIFY_SECRET

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " +
            new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
        form: {
          grant_type: "client_credentials",
        },
        json: true,
      }
    )

    const { access_token, expires_in } = response.data
    console.log(
      "🚀 ~ file: spotify.js:28 ~ getAccessToken ~ access_token:",
      access_token
    )
    accessToken = access_token
    const expirationTime = new Date().getTime() + expires_in * 1000
    tokenExpiration = expirationTime
    // // Set the token expiration time
    // const expirationTime = new Date().getTime() + expires_in * 1000;
    // tokenExpiration = expirationTime;

    return accessToken
  } catch (error) {
    // console.error("Error obtaining access token:", error)
    return null
  }
}
async function checkAndRefreshToken() {
  console.log("checkAndRefreshToken")
  console.log("current access token", accessToken)
  if (!accessToken || new Date().getTime() > tokenExpiration) {
    console.log("no token, getting a new one")
    refreshingTokenRequest = refreshingTokenRequest
      ? refreshingTokenRequest
      : getAccessToken()
    console.log(
      "Refreshing Token Request variable",
      refreshingTokenRequest.toJSON()
    )
    const newToken = await refreshingTokenRequest
    refreshingTokenRequest = null
    accessToken = newToken
    console.log("fetching data with new token")
    return
  }
}

async function getPlaylistTracks(playlist_id) {
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}`

  try {
    await checkAndRefreshToken()

    const headers = { Authorization: `Bearer ${accessToken}` }
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    // console.error(`Error fetching playlist tracks: ${error.message}`)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.error(error.response.data)
      // console.error(error.response.status)
      // console.error(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.error(error.request)
    }
    return null
  }
}

async function getCategoriesByCountry(country, locale) {
  const url = `https://api.spotify.com/v1/browse/categories?country=${country}&locale=${locale}&limit=50`

  try {
    await checkAndRefreshToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    // console.error("Get Categories By Country Error:", error)
    return null
  }
}
async function getPlayListByCategories(id, country) {
  try {
    const url = `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=${country}&limit=50`
    await checkAndRefreshToken()

    const headers = { Authorization: `Bearer ${accessToken}` }

    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    // console.error("Get Playlist By Country Error:", error)
    return null
  }
}
module.exports = {
  getCategoriesByCountry,
  getPlayListByCategories,
  getAccessToken,
  checkAndRefreshToken,
  getPlaylistTracks,
}
