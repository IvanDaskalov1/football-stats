"use client"

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import './animations.css'; // Import the CSS file
import { useEffect } from 'react';

  
  
// Sample news data
const footballNews = [
  {
    id: 1,
    title: "Champions League Final Set for Wembley",
    summary: "The UEFA Champions League final will be held at Wembley Stadium this year, with fans excited for the prestigious event.",
    date: "2025-05-10",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    title: "Premier League Transfer Window Opens",
    summary: "Clubs are preparing for a busy summer as the transfer window officially opens. Several big moves are expected.",
    date: "2025-06-01",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c643e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    title: "National Team Announces World Cup Squad",
    summary: "The national team coach has revealed the 26-player squad for the upcoming World Cup qualifiers.",
    date: "2025-04-15",
    imageUrl: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    title: "Star Striker Signs Record Contract",
    summary: "The league's top scorer has signed a record-breaking 5-year contract extension with his club.",
    date: "2025-07-12",
    imageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    title: "New Stadium Construction Begins",
    summary: "Construction has started on a new state-of-the-art stadium that will seat 60,000 fans when completed.",
    date: "2025-03-28",
    imageUrl: "https://images.unsplash.com/photo-1590552515252-3a5a1b4a9a97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb3RiYWxsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    title: "Legendary Manager Announces Retirement",
    summary: "After 25 years in management, the iconic coach has announced this season will be his last.",
    date: "2025-05-20",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  }
];

export default function Home() {
  const { isSignedIn, userId, isLoaded } = useAuth();

  useEffect(() => {

    if (!isLoaded) {
      console.log("⏳ Clerk is not yet loaded...");
      return;
    }

    if (isSignedIn) {
      console.log(`✅ User signed in (ID: ${userId}), calling /api/auth/user-check...`);

      fetch("/api/auth/user-check")
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ User check response:", data);
        })
        .catch((error) => console.error("❌ Error checking user:", error));
    }
  }, [isSignedIn, userId, isLoaded]);
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto p-6">
        <section className="mb-10">
          <h2 className="text-3xl text-gray-800 font-bold mb-6 animate-fade-in">Welcome to FootballStats</h2>
          <p className="text-lg text-gray-700 mb-8 animate-slide-up">
            Track live matches, make predictions, and stay updated with the latest football news.
          </p>
          
          <SignedIn>
            <div className="flex gap-4 mb-10 animate-bounce-in">
              <Link href="/matches" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105">
                View Matches
              </Link>
              <Link href="/predictions" className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105">
                Make Predictions
              </Link>
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg mb-10 animate-pulse-slow">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h3 className="text-white text-xl font-bold mb-2">Join FootballStats Today!</h3>
                  <p className="text-blue-100 mb-4">Sign in to make predictions, track your favorite teams, and compete with other fans.</p>
                  <div className="flex space-x-4">
                    <SignInButton mode="modal">
                      <button className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg font-medium transition transform hover:scale-105 hover:shadow-md">
                        Sign In
                      </button>
                    </SignInButton>
                    <Link href="/matches" className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600 px-5 py-2 rounded-lg font-medium transition">
                      Browse as Guest
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-float">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-14 md:w-14 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-ping-slow">
                    New
                  </div>
                </div>
              </div>
            </div>
          </SignedOut>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Football News</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {footballNews.map((news, index) => (
              <div 
                key={news.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:scale-102 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{news.title}</h3>
                  <p className="text-gray-600 mb-3">{news.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{news.date}</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium group">
                      Read More
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
