"use client";
import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Link from 'next/link';
import { TextComponent, AudioComponent } from '../../components/MediaBox';

export default function Home() {
  const [counter, setCounter] = useState(1);  
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState("");
  const [mediaData, setMediaData] = useState({ audioPath: "", is_real: false });


  function checkResponse(is_real) {
    if (is_real === mediaData.is_real) {
      console.log("yippee!");
    } else {
      console.log("oh no!");
    }
    setCounter(counter + 1);
    if (counter > 10) {
      window.location.href = "/";
    }
  }

  useEffect(() => {
    const fetchMediaData = async () => {
      setLoading(true);
      const type = "audio";
      setMediaType(type);
      const response = await fetch(`http://127.0.0.1:5000/random?type=${type}`);
      const data = await response.json();
      setMediaData({
        audioPath: data.audio_path,
        is_real: data.is_real,
      })
      setLoading(false);
    };

    fetchMediaData();
  }, [counter]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  console.log(mediaData);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <Head>
        <title>Did They Say?</title>
      </Head>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-12">Did They Say?</h1>
        <span className="text-xl">Counter: {counter}/10</span>
        {/*
        <div className="mt-12">
          <TextComponent imgSrc="https://d3i6fh83elv35t.cloudfront.net/static/2025/01/tariff-2-1024x683.jpg" text="America would be better if everyone went back to where they came from!!" onSelect={() => { }} />
        </div>
        */}
        <div className="mt-12">
          <AudioComponent audioSrc={mediaData.audioPath} onSelect={() => {}}/>
        </div>
        <div className="mt-12 flex flex-row justify-center items-center space-x-4 m-auto">
          <button onClick={() => {checkResponse(true)}} className="w-40 px-4 py-4 text-md font-semibold bg-cyan-500 hover:bg-cyan-700 rounded-lg transition">Yes</button>
          <button onClick={() => {checkResponse(false)}} className="w-40 px-4 py-4 text-md font-semibold bg-red-500 hover:bg-red-700 rounded-lg transition">No</button>
        </div>
      </div>
    </div>
  );
}  