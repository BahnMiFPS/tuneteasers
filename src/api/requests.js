const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DEPLOYMENT_URL
    : process.env.REACT_APP_LOCAL_URL

const requests = [
  {
    name: "Vietnam",
    url: `${SERVER_URL}/api/playlists?country=VN&locale=vi_VN`,
  },
  {
    name: "US",
    url: `${SERVER_URL}/api/playlists?country=US&locale=en_US`,
  },

  {
    name: "Kpop",
    url: `${SERVER_URL}/api/playlists?country=KR&locale=ko_KR`,
  },
]

export { requests }
