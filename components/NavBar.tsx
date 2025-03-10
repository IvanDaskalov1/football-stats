"use client"

import { useState } from 'react'
import Link from 'next/link'
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-600">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-xl">FootballStats</span>
            </Link>
            
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link href="/matches" className="text-blue-100 hover:text-white px-3 py-2 rounded-md font-medium transition">
                Matches
              </Link>
              <Link href="/predictions" className="text-blue-100 hover:text-white px-3 py-2 rounded-md font-medium transition">
                Predictions
              </Link>
              <Link href="/teams" className="text-blue-100 hover:text-white px-3 py-2 rounded-md font-medium transition">
                Teams
              </Link>
              <Link href="/stats" className="text-blue-100 hover:text-white px-3 py-2 rounded-md font-medium transition">
                Stats
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <SignedIn>
              <div className="flex items-center">
                <span className="text-blue-100 mr-3 hidden md:block">My Account</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition transform hover:scale-105 hover:shadow-md">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white focus:outline-none"
              >
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-blue-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/matches" 
            className="text-blue-100 hover:text-white block px-3 py-2 rounded-md font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Matches
          </Link>
          <Link 
            href="/predictions" 
            className="text-blue-100 hover:text-white block px-3 py-2 rounded-md font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Predictions
          </Link>
          <Link 
            href="/teams" 
            className="text-blue-100 hover:text-white block px-3 py-2 rounded-md font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Teams
          </Link>
          <Link 
            href="/stats" 
            className="text-blue-100 hover:text-white block px-3 py-2 rounded-md font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Stats
          </Link>
        </div>
      </div>
    </nav>
  )
}