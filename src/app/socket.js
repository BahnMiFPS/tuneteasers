import { io } from "socket.io-client"
import { SERVER_URL } from "../api/requests"

const socket = io.connect(SERVER_URL)
export default socket
