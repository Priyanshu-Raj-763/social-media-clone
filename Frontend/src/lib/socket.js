import { io } from "socket.io-client";

let socket = null;

export function connectSocket(userId) {
  if (socket) return socket; 
  const socketURL =
  import.meta.env.DEV
  ? "http://localhost:3000"
  : "/";

  socket = io(socketURL, {
    query: { userId },
    withCredentials: true,
    transports: ["websocket"],
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}