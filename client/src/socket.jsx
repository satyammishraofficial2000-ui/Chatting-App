import { io } from "socket.io-client";

const socket = io("https://quick-chat-app-qviu.onrender.com");

export default socket;