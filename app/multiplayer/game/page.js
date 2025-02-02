"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { TextComponent, AudioComponent } from "../../../components/MediaBox";

const socket = io("http://5.75.237.7:4017");

const GamePage = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState("");
  const [mediaData, setMediaData] = useState({ audioPath: "", is_real: false });
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("roomId");
    const user = params.get("username");
    if (!room || !user) return router.push("/");

    setRoomId(room);
    setUsername(user);
  }, [router]);

  useEffect(() => {
    if (!roomId) return;
    socket.emit("joinRoom", { roomId, username }, (res) => {
      if (!res.success) {
        alert(res.message);
        router.push("/");
      }
    });
  }, [roomId]);

  useEffect(() => {
    const fetchMediaData = async () => {
      setLoading(true);
      const type = "audio";
      setMediaType(type);
      const response = await fetch(`http://5.75.237.7:3048/random?type=${type}`);
      const data = await response.json();
      setMediaData({
        audioPath: data.audio_path,
        is_real: data.is_real,
      });
      setLoading(false);
    };

    if (counter <= 3) fetchMediaData();
  }, [counter]);

  function checkResponse(is_real) {
    if (is_real === mediaData.is_real) {
      console.log("Correct!");
    } else {
      console.log("Wrong!");
    }

    if (counter === 3) {
      setFinished(true);
      socket.emit("updateScore", { roomId, username });
      router.push(`/multiplayer/finish?roomId=${roomId}&username=${username}`);
    } else {
      setCounter(counter + 1);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Did They Say?</h1>
      <p className="mb-4">Round: {counter}/3</p>
      {mediaType === "audio" && <AudioComponent src={mediaData.audioPath} />}

      <div className="mt-6 flex space-x-4">
        <button onClick={() => checkResponse(true)} className="px-6 py-3 bg-green-500 hover:bg-green-700 text-lg rounded">Yes</button>
        <button onClick={() => checkResponse(false)} className="px-6 py-3 bg-red-500 hover:bg-red-700 text-lg rounded">No</button>
      </div>
    </div>
  );
};

export default GamePage;