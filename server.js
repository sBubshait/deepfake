import { Server } from "socket.io";
import crypto from "crypto";

const rooms = {}; // Store rooms { code: { players, gameStarted } }

function generateRoomCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 5-char code
}

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("createRoom", ({ name }, callback) => {
      const roomId = generateRoomCode();
      rooms[roomId] = { players: {}, gameStarted: false };
      rooms[roomId].players[socket.id] = { name, score: 0 };
      socket.join(roomId);
      callback({ success: true, roomId });
      io.to(roomId).emit("roomUpdate", rooms[roomId]);
    });

    socket.on("joinRoom", ({ roomId, name }, callback) => {
      if (!rooms[roomId]) {
        callback({ success: false, message: "Invalid room code" });
        return;
      }

      rooms[roomId].players[socket.id] = { name, score: 0 };
      socket.join(roomId);
      callback({ success: true });
      io.to(roomId).emit("roomUpdate", rooms[roomId]);
    });

    socket.on("startGame", (roomId) => {
      if (rooms[roomId] && Object.keys(rooms[roomId].players).length >= 2) {
        rooms[roomId].gameStarted = true;
        io.to(roomId).emit("gameStart", rooms[roomId]);
      }
    });

    socket.on("updateScore", ({ roomId, score }) => {
      if (rooms[roomId] && rooms[roomId].players[socket.id]) {
        rooms[roomId].players[socket.id].score = score;
        io.to(roomId).emit("scoreUpdate", rooms[roomId].players);
      }
    });

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        if (rooms[roomId].players[socket.id]) {
          delete rooms[roomId].players[socket.id];

          if (Object.keys(rooms[roomId].players).length === 0) {
            delete rooms[roomId];
          } else {
            io.to(roomId).emit("roomUpdate", rooms[roomId]);
          }
        }
      }
    });
  });

  res.end();
}
