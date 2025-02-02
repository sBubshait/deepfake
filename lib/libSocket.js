import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SOCKET_SERVER_URL = "http://localhost:4000";

export default function useSocket(roomId) {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL);
    setSocket(socketInstance);

    socketInstance.emit("joinRoom", { roomId, name: localStorage.getItem("playerName") }, (response) => {
      if (!response.success) {
        window.location.href = `/join-room?error=${response.message}`;
      }
    });

    socketInstance.on("roomUpdate", (room) => {
      setPlayers(room.players);
      setGameStarted(room.gameStarted);
    });

    socketInstance.on("gameStart", (room) => {
      setGameStarted(true);
      setPlayers(room.players);
    });

    socketInstance.on("scoreUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    return () => socketInstance.disconnect();
  }, [roomId]);

  const startGame = () => socket.emit("startGame", roomId);
  const updateScore = (score) => socket.emit("updateScore", { roomId, score });

  return { players, gameStarted, startGame, updateScore };
}
