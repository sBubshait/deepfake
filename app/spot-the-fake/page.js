"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MediaBox } from "../../components/MediaBox"; // Adjust the import path as necessary

const SpotTheFake = () => {
  const [counter, setCounter] = useState(1);
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleSubmit = () => {
    if (counter < 10) {
      setCounter(counter + 1);
      setSelected(null);
      // Fetch new images here
    } else {
      // Redirect to home screen
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-4xl font-bold">Spot the Fake</h1>
        <span className="text-xl">Counter: {counter}/10</span>
      </div>
      <div className="flex space-x-4 mt-8">
        <MediaBox id={1} selected={selected === 1} onSelect={handleSelect} imgSrc="/path/to/image1.jpg" />
        <MediaBox id={2} selected={selected === 2} onSelect={handleSelect} imgSrc="/path/to/image2.jpg" />
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

