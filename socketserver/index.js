const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const rooms = {}; // Global room storage

function generateRoomCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 5-char uppercase code
}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 🏠 Create Room
  socket.on("createRoom", ({ roomName, username }, callback) => {
    const roomId = generateRoomCode();
    rooms[roomId] = { players: {}, gameStarted: false, roomName };
    rooms[roomId].players[socket.id] = { name: username, score: 0 };

    socket.join(roomId);
    callback({ success: true, roomId });

    io.to(roomId).emit("roomUpdate", rooms[roomId]);
    console.log(`[CREATE ROOM] Room ${roomId} created by ${socket.id}`);
    console.log(rooms);
  });

  // 🔗 Join Room
  socket.on("joinRoom", ({ roomId, username }, callback) => {
    roomId = roomId.toUpperCase(); // Ensure case matches
    console.log(`[JOIN REQUEST] ${socket.id} trying to join ${roomId}`);
    console.log("Existing rooms:", rooms);

    if (!rooms[roomId]) {
      callback({ success: false, message: "Invalid room code" });
      return;
    }

    rooms[roomId].players[socket.id] = {username, score: 0};
    socket.join(roomId);
    callback({ success: true });

    io.to(roomId).emit("roomUpdate", rooms[roomId]);
    console.log(`[JOIN ROOM] ${username} (${socket.id}) joined Room ${roomId}`);
    console.log(rooms);
  });

  // 🎮 Start Game
  socket.on("startGame", (roomId) => {
    roomId = roomId.toUpperCase();
    if (rooms[roomId] && Object.keys(rooms[roomId].players).length >= 2) {
      rooms[roomId].gameStarted = true;
      io.to(roomId).emit("gameStart", rooms[roomId]);
      console.log(`[GAME START] Room ${roomId} started the game`);
    }
  });

  // 🏆 Update Score
  socket.on("updateScore", ({ roomId, score }) => {
    roomId = roomId.toUpperCase();
    if (rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id].score = score;
      io.to(roomId).emit("scoreUpdate", rooms[roomId].players);
    }
  });

  // ❌ Handle Disconnect
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].players[socket.id]) {
        delete rooms[roomId].players[socket.id];

        if (Object.keys(rooms[roomId].players).length === 0) {
            // do nothing
        } else {
          io.to(roomId).emit("roomUpdate", rooms[roomId]);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Socket.io Server running on port ${PORT}`));
