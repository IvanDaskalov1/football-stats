"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import Leaderboard from "@/components/Leaderboard"

export default function PredictionsPage() {
    const { user } = useUser()
    const [matches, setMatches] = useState<any[]>([])
    const [predictions, setPredictions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMatches() {
            try {
                const res = await fetch("/api/matches")
                const data = await res.json()
                setMatches(data.matches)
            } catch (error) {
                console.error("Error fetching matches:", error)
            }
        }

        async function fetchPredictions() {
            try {
                const res = await fetch("/api/predictions")
                const data = await res.json()
                setPredictions(data.predictions)
            } catch (error) {
                console.error("Error fetching predictions:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchMatches()
        fetchPredictions()
    }, [])

    const handlePredictionSubmit = async (matchId: number, prediction: string) => {
        if (!user) return alert("You must be signed in to submit predictions!")

        if (!prediction.trim()) {
            return alert("Prediction cannot be empty!")
        }

        const payload = {
            userId: user.id,
            userName: user.firstName,
            matchId,
            prediction,
        }

        console.log("Sending payload:", payload) // ✅ Check if data is correct before sending

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
            console.log("Prediction saved:", data)

            setPredictions([...predictions, { matchId, prediction }])
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Predictions</h1>
            <Leaderboard />
            <SignedOut>
                <p>You must be signed in to make predictions.</p>
                <SignInButton />
            </SignedOut>

            <SignedIn>
                {loading && <p>Loading...</p>}
                {!loading && matches.length === 0 && <p>No upcoming matches.</p>}

                {!loading && matches.length > 0 && (
                    <ul>
                        {matches.map((match) => (
                            <li key={match.id} className="border p-4 mb-2 flex justify-between items-center">
                                <div>
                                    {match.homeTeam.name} vs {match.awayTeam.name} - {new Date(match.utcDate).toLocaleString()}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter prediction (e.g. 2-1)"
                                        className="border p-2 mr-2"
                                        value={predictions.find((p) => p.matchId === match.id)?.prediction || ""}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setPredictions((prev) => {
                                                const existing = prev.find((p) => p.matchId === match.id)
                                                if (existing) {
                                                    return prev.map((p) => (p.matchId === match.id ? { ...p, prediction: value } : p))
                                                } else {
                                                    return [...prev, { matchId: match.id, prediction: value }]
                                                }
                                            })
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const prediction = predictions.find((p) => p.matchId === match.id)?.prediction || ""
                                            handlePredictionSubmit(match.id, prediction)
                                        }}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </SignedIn>
        </main>
    )
}