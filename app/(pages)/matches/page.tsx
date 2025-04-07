"use client"

import { useEffect, useState } from "react"
import CalendarComponent from "@/components/CalendarComponent"
import { Match } from "@/types"
import MatchCard from "@/components/MatchCard"

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("/api/matches")
        if (!res.ok) throw new Error(`Error fetching matches: ${res.statusText}`)

        const data = await res.json()
        const matchesData = Array.isArray(data.matches) ? data.matches : []
        setMatches(matchesData)
        setFilteredMatches(matchesData) // Initially show all matches
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  // Filter matches when a date is selected
  useEffect(() => {
    if (selectedDate && matches.length > 0) {
      // Convert to UTC date string for comparison
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const filtered = matches.filter(match => {
        // Extract just the date part from the UTC date string
        const matchDate = match.utcDate.split('T')[0];
        return matchDate === dateString;
      });
      
      setFilteredMatches(filtered);
    } else {
      setFilteredMatches(matches);
    }
  }, [selectedDate, matches])

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  // Reset date filter
  const clearDateFilter = () => {
    setSelectedDate(null)
    setFilteredMatches(matches)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Football Matches</h1>
          <p className="text-blue-600">View upcoming and past matches from top leagues</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Select Date</h2>
              <CalendarComponent 
                matches={matches} 
                selectedDate={selectedDate} 
                onDateSelect={handleDateSelect} 
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Filter Matches</h2>
              {/* ... existing filter controls ... */}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-blue-700">
                  {selectedDate ? (
                    `Matches on ${selectedDate.toLocaleDateString()}`
                  ) : (
                    "All Matches"
                  )}
                </h2>
                {/* ... existing controls ... */}
              </div>
              {error && (
                <div className="text-red-600 font-medium my-4">
                    ⚠️ {error}
                </div>
              )}
              {selectedDate && (
                <button
                onClick={clearDateFilter}
                className="text-sm text-blue-600 underline mt-2"
                >
                  Clear Date Filter
                </button>
              )}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="text-center py-12 bg-blue-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-lg text-blue-700 font-medium">No matches found for this date</p>
                  <p className="text-blue-500 mt-2">Try selecting a different date or adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-blue-300 rounded-full opacity-40 blur-3xl"></div>
    </div>
  )
}