"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const getScoreMessage = (score) => {
    if (score === 10) return "🎉 Perfect! You're a master at spotting deep fakes!";
    if (score >= 7) return "😎 Great job! You have a sharp eye for fakes.";
    if (score >= 4) return "🤔 Not bad! But you might have been tricked a few times.";
    return "😵 Oof! The fakes got you this time. Try again!";
  };

const ScorePage = () => {
  const router = useRouter();
  const MAX_ROUNDS = 3;
  const searchParams = useSearchParams();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const scoreParam = searchParams.get("score");
    if (scoreParam) {
      setScore(parseInt(scoreParam, 10));
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">Your Score: {score}/{MAX_ROUNDS}</h1>
        <p className="text-2xl mb-12">{getScoreMessage(score)}</p>
        <div className="flex flex-row items-center align-middle justify-center space-x-4">
          <Link href="/single-player" className="w-52 px-6 py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
            Play Again
          </Link>
          <Link href="/" className="w-52 px-6 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg transition">
            Main Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
