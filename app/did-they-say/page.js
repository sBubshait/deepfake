import Head from 'next/head';
import Link from 'next/link';
import { TextComponent, AudioComponent } from '../../components/MediaBox'; 

export default function Home() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Head>
          <title>Deep Fake</title>
        </Head>
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-16">Deep Fake</h1>
          <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <Head>
        <title>Deep Fake</title>
      </Head>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-12">Deep Fake</h1>
        <div className="mt-12 flex flex-row items-center space-x-6">
          <TextComponent imgSrc="https://d3i6fh83elv35t.cloudfront.net/static/2025/01/tariff-2-1024x683.jpg" text="Example text content" />
          <AudioComponent imgSrc="https://d3i6fh83elv35t.cloudfront.net/static/2025/01/tariff-2-1024x683.jpg" src="/example-audio.mp3" />
        </div>
      </div>
    </div>
        </div>
      </div>
    );
  }  