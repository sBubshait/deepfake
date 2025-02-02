'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import generateUsername from 'trendy-username';

export default function JoinRoom () {
    const [roomCode, setRoomCode] = useState('');
    const [username, setUsername] = useState('');
  
    useEffect(() => {
        // Generate a username when the component mounts
        const generatedUsername = generateUsername(1, "male");
        console.log(generateUsername)
        setUsername(generatedUsername);
      }, []);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-md p-8 space-y-8">
          <h1 className="text-4xl font-bold text-center mb-8">Join a Room</h1>
          <input
            type="text"
            placeholder="Enter Room Code"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            username={username}
            onChange={(e) => setUsername(e.target.value)}
           />
          <Link
            href={`/multiplayer/waiting?roomId=${roomCode}&username=${username}`}
            className={`w-full px-6 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center justify-center ${
              !roomCode ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={(e) => {
              if (!roomCode) e.preventDefault();
            }}
          >
            Join Room
          </Link>
        </div>
      </div>
    );
  };