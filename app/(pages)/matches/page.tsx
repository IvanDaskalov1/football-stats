"use client"

import { useEffect, useState } from "react"
import CalendarComponent from "@/components/CalendarComponent"
import { Match } from "@/types"


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
      } catch (error: any) {
        setError(error.message)
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
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Matches</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Matches list - takes more space on larger screens */}
        <div className="w-full md:w-2/3">
          {loading && <p className="text-gray-600">Loading matches...</p>}
          {error && <p className="text-red-600">{error}</p>}
          
          {selectedDate && (
            <div className="mb-4 flex items-center">
              <p className="text-blue-600 font-medium">
                Showing matches for: {selectedDate.toLocaleDateString()}
              </p>
              <button 
                onClick={clearDateFilter}
                className="ml-3 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {!loading && !error && filteredMatches.length === 0 && (
            <p className="text-gray-600">
              {selectedDate 
                ? `No matches found for ${selectedDate.toLocaleDateString()}.` 
                : "No matches available at the moment."}
            </p>
          )}

          <div className="space-y-4">
            {filteredMatches.map(match => (
              <div key={match.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-semibold">{match.homeTeam.name} vs {match.awayTeam.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(match.utcDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-lg">
                    {match.status === "FINISHED" ? (
                      <span className="text-green-600">
                        {match.score.fullTime.home} - {match.score.fullTime.away}
                      </span>
                    ) : (
                      <span className="text-gray-500">Upcoming</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calendar - positioned on the right side */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-2">Match Calendar</h2>
            <CalendarComponent onDateSelect={handleDateSelect} selectedDate={selectedDate} matches={matches} />
          </div>
        </div>
      </div>
    </main>
  )
}