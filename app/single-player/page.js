import React from 'react';
import Link from 'next/link';

const ModeSelection = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-16">Mode</h1>
        <div className="flex space-x-4">
          <Link href="/did-they-say" className="w-52 px-6 py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
            Did they say?
          </Link>
          <Link href="/spot-the-fake" className="w-52 px-6 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg transition">
            Spot the fake
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;