import { io } from "socket.io-client"

const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DEPLOYMENT_URL
    : process.env.REACT_APP_LOCAL_URL

const socket = io.connect(SERVER_URL)
export default socket
