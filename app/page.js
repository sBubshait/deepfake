import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <Head>
        <title>Deep Fake</title>
      </Head>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-16">Deep Fake</h1>
        <div className="flex flex-col items-center space-y-4">
          <Link href="/single-player" className="w-52 px-6 py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">Single Player
          </Link>
          <Link href="/multiplayer"className="w-52 px-6 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg transition">Multiplayer
          </Link>
        </div>
      </div>
    </div>
  );
}
