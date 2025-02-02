"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextComponent, AudioComponent } from "../../components/MediaBox"; // Adjust the import path as necessary

const DidTheySay = () => {
  const MAX_ROUNDS = 3;
  const [counter, setCounter] = useState(1);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState("");
  const [mediaData, setMediaData] = useState({ audioPath: "", is_real: false });
  const router = useRouter();

  const checkResponse = (is_real) => {
    let newScore = score+1;
    if (is_real) {
      setScore(newScore);
    } else {
      console.log("oh no!");
    }
    console.log(score);
    setCounter(counter + 1);
    if (counter >= MAX_ROUNDS) {
      router.push(`/score-page?score=${newScore}`);
    }
  };

  function handleSelect(id) { setSelected(id); }

  useEffect(() => {
    const fetchMediaData = async () => {
      setLoading(true);
      const type = "audio";
      setMediaType(type);
      const response = await fetch(`http://5.75.237.7:3048/demo?type=${type}`);
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

  console.log(mediaData.audioPath);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-4xl font-bold">Did They Say?</h1>
        <span className="text-xl">Question: {counter}/{MAX_ROUNDS}</span>
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
      <div className="flex space-x-4 mt-8">
        <button
          onClick={() => checkResponse(!mediaData.is_real)}
          className="px-6 py-3 text-lg font-semibold rounded-lg transition bg-green-600 hover:bg-green-700"
        >
          Yes
        </button>
        <button
          onClick={() => checkResponse(mediaData.is_real)}
          className="px-6 py-3 text-lg font-semibold rounded-lg transition bg-red-600 hover:bg-red-700"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DidTheySay;