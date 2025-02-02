"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { User, Trophy } from "lucide-react";

const SOCKET_SERVER_URL = "http://5.75.237.7:4017";

export default function FinishPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const username = searchParams.get("username");
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [finishedPlayers, setFinishedPlayers] = useState({});
  const [showScores, setShowScores] = useState(false);
  const [finalScore, setFinalScore] = useState(0); // Get this from your game state

  useEffect(() => {
    if (!roomId || !username) {
      router.push("/multiplayer/join?error=Invalid Room or Username");
      return;
    }

    const socketInstance = io(SOCKET_SERVER_URL);
    setSocket(socketInstance);

    socketInstance.emit("getFinishState", roomId);

    // Notify server that player finished
    // socketInstance.emit("playerFinished", { 
    //   roomId, 
    //   finalScore
    // });

    // Listen for updates about finished players
    socketInstance.on("finishUpdate", ({ finished, players, allFinished }) => {
      setFinishedPlayers(finished);
      setPlayers(Object.values(players));
      setShowScores(allFinished);
    });

    return () => socketInstance.disconnect();
  }, [roomId, username, router, finalScore]);

  const getLeaderboard = () => {
    return [...players].sort((a, b) => b.score - a.score);
  };

  const getWaitingPlayers = () => {
    return players.filter(player => 
      !Object.entries(finishedPlayers).find(([id, finished]) => 
        players.find(p => p.socketId === id)?.username === player.username
      )
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        {!showScores ? (
          // Waiting screen
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">Awaiting Players</h1>
            <div className="space-y-4">
              {getWaitingPlayers().map((player, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <User className="w-6 h-6" />
                  <span>{player.username}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Leaderboard
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold mb-8">Final Scores</h1>
            <div className="space-y-6">
              {getLeaderboard().map((player, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-600' : 
                    index === 1 ? 'bg-gray-600' : 
                    index === 2 ? 'bg-amber-700' : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold">{index + 1}</span>
                    <User className="w-6 h-6" />
                    <span className="text-xl">{player.username}</span>
                  </div>
                  <span className="text-xl font-bold">{player.score}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/multiplayer')}
              className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};