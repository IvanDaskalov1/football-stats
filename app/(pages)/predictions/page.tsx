"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import Leaderboard from "@/components/Leaderboard"
import { Match, Prediction } from "@/types"

export default function PredictionsPage() {
    const { user } = useUser()
    const [matches, setMatches] = useState<Match[]>([])
    const [userPredictions, setUserPredictions] = useState<Record<number, string>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch matches
                const matchesRes = await fetch("/api/matches")
                const matchesData = await matchesRes.json()
                
                // Sort matches by date (upcoming first)
                const sortedMatches = matchesData.matches.sort((a: Match, b: Match) => 
                    new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
                )
                setMatches(sortedMatches)
                
                // Only fetch predictions if user is logged in
                if (user) {
                    const predictionsRes = await fetch("/api/predictions")
                    const predictionsData = await predictionsRes.json()
                    
                    // Filter predictions for current user and create a map of matchId -> prediction
                    const userPreds = predictionsData.predictions
                        .filter((p: Prediction) => p.userId === user.id)
                        .reduce((acc: Record<number, string>, p: Prediction) => {
                            acc[p.matchId] = p.prediction
                            return acc
                        }, {})
                    
                    setUserPredictions(userPreds)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user])

    const handlePredictionSubmit = async (matchId: number, prediction: string) => {
        if (!user) return alert("You must be signed in to submit predictions!")

        if (!prediction.trim()) {
            return alert("Prediction cannot be empty!")
        }

        // Validate prediction format (e.g., "2-1")
        if (!/^\d+-\d+$/.test(prediction)) {
            return alert("Prediction must be in format '0-0'")
        }

        setSubmitting(true)
        setSuccessMessage(null)

        const payload = {
            userId: user.id,
            userName: user.firstName || user.username || "User",
            matchId,
            prediction,
        }

        try {
            const res = await fetch("/api/predictions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const errorData = await res.json()
                console.error("Error saving prediction:", errorData)
                throw new Error("Error saving prediction")
            }

            const data = await res.json()
            
            // Update local state with the new prediction
            setUserPredictions(prev => ({
                ...prev,
                [matchId]: prediction
            }))
            
            setSuccessMessage("Prediction saved successfully!")
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (error) {
            console.error(error)
            alert("Failed to save prediction. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    // Filter to show only upcoming matches
    const upcomingMatches = matches.filter(match => 
        match.status !== "FINISHED" && match.status !== "IN_PLAY"
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <main className="p-6 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-indigo-800 mb-2">Predictions</h1>
                    <p className="text-indigo-600">Test your football knowledge and compete with other fans</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side - Prediction Form */}
                    <div className="w-full md:w-2/3">
                        <SignedOut>
                            <div className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white">
                                <h2 className="text-2xl font-bold mb-4">Join the Prediction League!</h2>
                                <p className="mb-6 text-indigo-100">Sign in to make your predictions and compete for the top spot on our leaderboard.</p>
                                <SignInButton mode="modal">
                                    <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition transform hover:scale-105 shadow-md">
                                        Sign In to Predict
                                    </button>
                                </SignInButton>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4 text-indigo-700">Make Your Predictions</h2>
                                
                                {successMessage && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                        {successMessage}
                                    </div>
                                )}
                                
                                {loading && (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                                    </div>
                                )}
                                
                                {!loading && upcomingMatches.length === 0 && (
                                    <div className="text-center py-10 bg-indigo-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-lg text-indigo-700 font-medium">No upcoming matches available</p>
                                        <p className="text-indigo-500 mt-2">Check back soon for new matches to predict</p>
                                    </div>
                                )}

                                {!loading && upcomingMatches.length > 0 && (
                                    <ul className="space-y-4">
                                        {upcomingMatches.map((match) => (
                                            <li key={match.id} className="border border-indigo-100 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition">
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                                    <div>
                                                        <div className="font-semibold text-lg text-indigo-800">
                                                            {match.homeTeam.name} vs {match.awayTeam.name}
                                                        </div>
                                                        <div className="text-sm text-indigo-500">
                                                            {new Date(match.utcDate).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 2-1"
                                                            className="border border-indigo-200 p-2 rounded w-24 text-center focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                                                            value={userPredictions[match.id] || ""}
                                                            onChange={(e) => {
                                                                setUserPredictions(prev => ({
                                                                    ...prev,
                                                                    [match.id]: e.target.value
                                                                }))
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handlePredictionSubmit(match.id, userPredictions[match.id] || "")}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:bg-indigo-300 transition"
                                                            disabled={submitting}
                                                        >
                                                            {submitting ? "Saving..." : "Submit"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </SignedIn>
                    </div>
                    
                    {/* Right side - Leaderboard */}
                    <div className="w-full md:w-1/3 mt-6 md:mt-0">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Prediction Leaderboard
                                </h2>
                            </div>
                            <div className="p-4">
                                <Leaderboard />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Decorative elements */}
            <div className="fixed -bottom-24 -right-24 w-64 h-64 bg-indigo-200 rounded-full opacity-50 blur-3xl"></div>
            <div className="fixed -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full opacity-40 blur-3xl"></div>
        </div>
    )
}