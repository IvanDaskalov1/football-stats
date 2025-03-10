"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/">FootballStats</Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Show these links only when signed in */}
        <SignedIn>
          <Link href="/matches" className="hover:underline">
            Matches
          </Link>
          <Link href="/calendar" className="hover:underline">
            Calendar
          </Link>
          <Link href="/predictions" className="hover:underline">
            Predictions
          </Link>
          <UserButton />
        </SignedIn>

        {/* Show Sign In / Sign Up buttons only when signed out */}
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
      </div>
    </nav>
  )
}