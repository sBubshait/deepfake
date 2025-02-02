import Link from 'next/link';

export default function Home() {
        return (
          <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-16">Choose a Room</h1>
              <div className="flex space-x-4">
                
                <Link href="/multiplayer/create" className="w-52 px-6 py-4 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                  Create a Room
                </Link>
                <Link href="/multiplayer/join" className="w-52 px-6 py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
                 Join a Room
                </Link>
              </div>
            </div>
          </div>
        );
}