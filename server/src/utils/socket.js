// Socket.io instance — shared across controllers
// controllers import this to emit events
import { Server } from "socket.io";

let _io = null;

export function initIO(httpServer) {
  if (!_io) {
    _io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
      },
    });
  }
  return _io;
}

export function getIO() {
  if (!_io) throw new Error("Socket.io not initialized");
  return _io;
}
