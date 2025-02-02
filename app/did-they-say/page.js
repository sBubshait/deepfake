"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextComponent, AudioComponent } from "../../components/MediaBox"; // Adjust the import path as necessary

const DidTheySay = () => {
  const [counter, setCounter] = useState(1);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState("");
  const [mediaData, setMediaData] = useState({ audioPath: "", is_real: false });
  const router = useRouter();

  const checkResponse = (is_real) => {
    if (is_real === mediaData.is_real) {
      setScore(score + 1);
    } else {
      console.log("oh no!");
    }
    setCounter(counter + 1);
    if (counter >= 10) {
      router.push(`/score-page?score=${score}`);
    }
  };

  function handleSelect(id) { setSelected(id); }

  useEffect(() => {
    const fetchMediaData = async () => {
      setLoading(true);
      const type = "audio";
      setMediaType(type);
      const response = await fetch(`http://127.0.0.1:5000/random?type=${type}`);
      const data = await response.json();
      setMediaData({
        audioPath: type === "audio" ? data.audio_path : data.real_text,
        is_real: data.is_real,
        character: data.character.img
      });
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

  console.log(mediaData.character);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-4xl font-bold">Did They Say?</h1>
        <span className="text-xl">Counter: {counter}/10</span>
      </div>
      <div className="flex space-x-4 mt-8">
        {mediaType === "audio" ? (
          <AudioComponent
            id={1}
            selected={selected === 1}
            onSelect={handleSelect}
            imgSrc={mediaData.character}
            audioSrc={mediaData.audioPath}
          />
        ) : (
          <TextComponent
            id={1}
            selected={selected === 1}
            onSelect={handleSelect}
            imgSrc={mediaData.character}
            text={mediaData.audioPath}
          />
        )}
      </div>
      <button
        onClick={() => checkResponse(true)}
        className="mt-8 px-6 py-3 text-lg font-semibold rounded-lg transition bg-green-600 hover:bg-green-700"
      >
        Yes
      </button>
      <button
        onClick={() => checkResponse(false)}
        className="mt-8 px-6 py-3 text-lg font-semibold rounded-lg transition bg-red-600 hover:bg-red-700"
      >
        No
      </button>
    </div>
  );
};

export default DidTheySay;