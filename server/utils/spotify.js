const axios = require("axios")
require("dotenv").config()

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
    const accessToken = access_token

    // // Set the token expiration time
    // const expirationTime = new Date().getTime() + expires_in * 1000;
    // tokenExpiration = expirationTime;

    return accessToken
  } catch (error) {
    console.error("Error obtaining access token:", error)
    return null
  }
}

module.exports = {
  getAccessToken,
}
