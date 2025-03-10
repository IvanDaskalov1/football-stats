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
        <main className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Predictions</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left side - Prediction Form */}
                <div className="w-full md:w-2/3">
                    <SignedOut>
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="mb-3">You must be signed in to make predictions.</p>
                            <SignInButton mode="modal">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                    Sign In to Predict
                                </button>
                            </SignInButton>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Make Your Predictions</h2>
                            
                            {successMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                    {successMessage}
                                </div>
                            )}
                            
                            {loading && <p className="text-gray-600">Loading matches...</p>}
                            
                            {!loading && upcomingMatches.length === 0 && (
                                <p className="text-gray-600">No upcoming matches available for predictions.</p>
                            )}

                            {!loading && upcomingMatches.length > 0 && (
                                <ul className="space-y-4">
                                    {upcomingMatches.map((match) => (
                                        <li key={match.id} className="border p-4 rounded-lg shadow-sm bg-white">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                                <div>
                                                    <div className="font-semibold text-lg text-black">
                                                        {match.homeTeam.name} vs {match.awayTeam.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(match.utcDate).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 2-1"
                                                        className="border border-black p-2 rounded w-24 text-center text-gray-700"
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
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
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
                    <Leaderboard />
                </div>
            </div>
        </main>
    )
}