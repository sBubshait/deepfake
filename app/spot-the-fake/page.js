"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextComponent, AudioComponent } from "../../components/MediaBox"; // Adjust the import path as necessary

const SpotTheFake = () => {
  const [counter, setCounter] = useState(1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [mediaData, setMediaData] = useState({ real: "", fake: "" });
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMediaData = async () => {
      setLoading(true);
      const type = "audio";
      setMediaType(type);
      try {
        const response = await fetch(`http://127.0.0.1:5000/pair?type=${type}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMediaData({
          real: type === "audio" ? data.real_audio_path : data.real_text,
          fake: type === "audio" ? data.fake_audio_path : data.fake_text,
        });
      } catch (error) {
        console.error("Failed to fetch media data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [counter]);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleSubmit = () => {
    if (selected === 1) {
      setScore(score + 1);
    } else if (selected === 2) {
      console.log("oh no!");
    }
    if (counter < 10) {
      setCounter(counter + 1);
      setSelected(null);
    } else {
      router.push(`/score-page?score=${score}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-4xl font-bold">Spot the Fake</h1>
        <span className="text-xl">Counter: {counter}/10</span>
      </div>
      <div className="flex space-x-4 mt-8">
        {mediaType === "audio" ? (
          <>
            <AudioComponent
              id={1}
              selected={selected === 1}
              onSelect={handleSelect}
              imgSrc="/path/to/audio-placeholder.jpg"
              audioSrc={mediaData.real}
            />
            <AudioComponent
              id={2}
              selected={selected === 2}
              onSelect={handleSelect}
              imgSrc="/path/to/audio-placeholder.jpg"
              audioSrc={mediaData.fake}
            />
          </>
        ) : (
          <>
            <TextComponent
              id={1}
              selected={selected === 1}
              onSelect={handleSelect}
              imgSrc="/path/to/text-placeholder.jpg"
              text={mediaData.real}
            />
            <TextComponent
              id={2}
              selected={selected === 2}
              onSelect={handleSelect}
              imgSrc="/path/to/text-placeholder.jpg"
              text={mediaData.fake}
            />
          </>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null}
        className={`mt-8 px-6 py-3 text-lg font-semibold rounded-lg transition ${
          selected === null
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Submit
      </button>
    </div>
  );
};

export default SpotTheFake;

