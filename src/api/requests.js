const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DEPLOYMENT_URL
    : process.env.REACT_APP_LOCAL_URL

export { SERVER_URL }
