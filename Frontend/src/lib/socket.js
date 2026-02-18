import { io } from "socket.io-client";

let socket = null;

export function connectSocket(userId) {
  if (socket) return socket; 

  socket = io("http://localhost:3000", {
    query: { userId },
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