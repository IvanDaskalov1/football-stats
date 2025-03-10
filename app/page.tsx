import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        <h2 className="text-2xl font-semibold">Welcome to Football Stats</h2>
        <p className="mt-2 text-gray-700">Track live matches, statistics, and make predictions.</p>
      </main>
    </div>
  );
}
