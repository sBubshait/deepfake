"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { User } from "lucide-react";

const SOCKET_SERVER_URL = "http://5.75.237.7:4017";

export default function WaitingRoom() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const username = searchParams.get("username");
  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState("Waiting Room");

  useEffect(() => {
    if (!roomId) {
      router.push("/multiplayer/join?error=Invalid Room ID");
      return;
    }
    if (!username) {
        router.push("/multiplayer/join?error=Invalid Username");
        return;
    }

    const socketInstance = io(SOCKET_SERVER_URL);
    setSocket(socketInstance);

    socketInstance.emit("joinRoom", { roomId, username, name: "Test" }, (response) => {
      if (!response.success) {
        router.push(`/multiplayer/join?error=${response.message}`);
      }      
    });

    socketInstance.on("roomUpdate", (room) => {
        setRoomName(room.roomName);
      setPlayers(Object.values(room.players));
    });

    socketInstance.on("gameStart", () => {
        router.push(`/multiplayer/game?roomId=${roomId}&username=${username}`);
      });

    return () => socketInstance.disconnect();
  }, [roomId, router]);

  const handleStartGame = () => {
    if (players.length >= 2) {
      console.log("Starting game...");
      socket.emit("startGame", roomId);
    } else {
      alert("At least 2 players are required to start the game!");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold mb-2">{roomName}</h1>
          <p className="text-gray-300 mb-8">Room Code: <span className="font-mono text-xl">{roomId}</span></p>

          <div className="grid grid-cols-3 gap-8">
            {players.map((player, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <p className="text-gray-300">{player.username}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleStartGame}
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-12 py-4 text-lg font-semibold rounded-lg transition ${
          players.length >= 2 ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
        }`}
        disabled={players.length < 2}
      >
        Start
      </button>
    </div>
  );
}