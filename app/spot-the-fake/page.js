"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextComponent, AudioComponent } from "../../components/MediaBox"; // Adjust the import path as necessary

const SpotTheFake = () => {
  const MAX_ROUNDS = 3;
  const [counter, setCounter] = useState(1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [mediaData, setMediaData] = useState({ real: "", fake: "" });
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRealFirst, setIsRealFirst] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMediaData = async () => {
      setLoading(true);
      const type = "audio";
      setMediaType(type);
      try {
        const response = await fetch(`http://5.75.237.7:3048/pair?type=${type}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMediaData({
          real: type === "audio" ? data.real_audio_path : data.real_text,
          fake: type === "audio" ? data.fake_audio_path : data.fake_text,
          character: data.character
        });
        setIsRealFirst(Math.random() > 0.5);
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
    const isCorrect = (isRealFirst && selected === 1) || (!isRealFirst && selected === 2);
    let newScore = score+1;
    if (isCorrect) {
      setScore(newScore);
    } else {
      console.log("oh no!");
    }
    if (counter >= MAX_ROUNDS) {
      setCounter(counter + 1);
      setSelected(null);
    } else {
      router.push(`/score-page?score=${newScore}`);
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
        <span className="text-xl">Question: {counter}/{MAX_ROUNDS}</span>
      </div>
      <div className="flex space-x-4 mt-8">
        {mediaType === "audio" ? (
          <>
            {isRealFirst ? (
              <>
                <AudioComponent
                  id={1}
                  selected={selected === 1}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  audioSrc={mediaData.real}
                />
                <AudioComponent
                  id={2}
                  selected={selected === 2}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  audioSrc={mediaData.fake}
                />
              </>
            ) : (
              <>
                <AudioComponent
                  id={1}
                  selected={selected === 1}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  audioSrc={mediaData.fake}
                />
                <AudioComponent
                  id={2}
                  selected={selected === 2}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  audioSrc={mediaData.real}
                />
              </>
            )}
          </>
        ) : (
          <>
            {isRealFirst ? (
              <>
                <TextComponent
                  id={1}
                  selected={selected === 1}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  text={mediaData.real}
                />
                <TextComponent
                  id={2}
                  selected={selected === 2}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  text={mediaData.fake}
                />
              </>
            ) : (
              <>
                <TextComponent
                  id={1}
                  selected={selected === 1}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  text={mediaData.fake}
                />
                <TextComponent
                  id={2}
                  selected={selected === 2}
                  onSelect={handleSelect}
                  imgSrc={mediaData.character.img}
                  text={mediaData.real}
                />
              </>
            )}
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

