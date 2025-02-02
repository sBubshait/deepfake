'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "../../../lib/libSocket";
import generateUsername from 'trendy-username';

export default function CreateRoom(){
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState();
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const emojis = ['🎮', '🎲', '🎯', '🎪', '🎭'];

  useEffect(() => {
    // Generate a username when the component mounts
    const generatedUsername = generateUsername(1, "male");
    console.log(generateUsername)
    setUsername(generatedUsername);
  }, []);

  const handleCreateRoom = () => {
    const socket = io(SOCKET_SERVER_URL);
    socket.emit("createRoom", { roomName, username, emoji: selectedEmoji }, (response) => {
      if (!response.success) {
        alert(response.message);
      } else {
        window.location.href = `/multiplayer/waiting?roomId=${response.roomId}&username=${username}`;
      }
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Create a Room</h1>
        <input
          type="text"
          placeholder="Room Name"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="grid grid-cols-5 gap-4 my-6">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`text-3xl p-4 rounded-lg ${
                selectedEmoji === emoji ? 'bg-indigo-600' : 'bg-gray-800'
              } hover:bg-indigo-700 transition`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <button
          onClick={handleCreateRoom}
          className={`w-full px-6 py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center justify-center ${
            !roomName || !selectedEmoji ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Create Room
        </button>
      </div>
    </div>
  );
};