import { io } from "socket.io-client"
const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? process.env.SERVER_URL
    : process.env.LOCAL_URL

const socket = io.connect(SERVER_URL)
export default socket
