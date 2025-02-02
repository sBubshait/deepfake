"use client";
import React from 'react';

export function MediaBox({ id, selected, imgSrc, onSelect, children }) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`border-2 border-dashed ${selected ? "border-cyan-300" : "border-gray-500"} p-4 rounded-lg flex flex-col items-center bg-gray-800 text-white w-64 cursor-pointer`}
    >
      <img src={imgSrc} alt="Media content" className="w-48 h-48 object-cover rounded-lg mb-4" />
      {children}
    </div>
  );
}

export function TextComponent({ id, selected = false, imgSrc, text, onSelect }) {
  return (
    <MediaBox id={id} selected={selected} imgSrc={imgSrc} onSelect={onSelect}>
      <p className="text-lg font-semibold text-center">{text}</p>
    </MediaBox>
  );
}

export function AudioComponent({ id, selected = false, imgSrc, audioSrc, onSelect }) {
  return (
    <MediaBox id={id} selected={selected} imgSrc={imgSrc} onSelect={onSelect}>
      <audio controls className="w-full">
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </MediaBox>
  );
}
