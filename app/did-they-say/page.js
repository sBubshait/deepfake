"use client";
import Head from 'next/head';
import Link from 'next/link';
import { TextComponent, AudioComponent } from '../../components/MediaBox';

export default function Home() {

  useEffect(() => {
    const fetchMediaData = async () => {
      const type = "audio";
      setMediaType(type);
      const response = await fetch(`http://localhost:5000/pair?type=${type}`);
      const data = await response.json();
      setMediaData({
        real: type === "audio" ? data.real_audio_path : data.real_text,
        fake: type === "audio" ? data.fake_audio_path : data.fake_text,
      });
    };

    fetchMediaData();
  }, [counter]);
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <Head>
        <title>Did They Say?</title>
      </Head>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-12">Did They Say?</h1>
        <div className="mt-12">
          <TextComponent imgSrc="https://d3i6fh83elv35t.cloudfront.net/static/2025/01/tariff-2-1024x683.jpg" text="America would be better if everyone went back to where they came from!!" onSelect={() => { }} />
        </div>
        <div className="mt-12 flex flex-row justify-center items-center space-x-4 m-auto">
          <button className="w-40 px-4 py-4 text-md font-semibold bg-cyan-500 hover:bg-cyan-700 rounded-lg transition">Yes</button>
          <button className="w-40 px-4 py-4 text-md font-semibold bg-red-500 hover:bg-red-700 rounded-lg transition">No</button>
        </div>
      </div>
    </div>
  );
}  