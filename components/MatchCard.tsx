// components/MatchCard.tsx – Компонент за показване на един мач
import React from 'react'
import { Match } from "@/types"
import Image from "next/image"

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  // Format the date
  const matchDate = new Date(match.utcDate)
  const formattedDate = matchDate.toLocaleDateString()
  const formattedTime = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{formattedDate} • {formattedTime}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            match.status === "FINISHED" ? "bg-gray-100 text-gray-800" : 
            match.status === "IN_PLAY" ? "bg-green-100 text-green-800" : 
            "bg-blue-100 text-blue-800"
          }`}>
            {match.status === "SCHEDULED" ? "Upcoming" : match.status}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3">
              {match.homeTeam.crest && (
                <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-full h-full object-contain" />
              )}
            </div>
            <span className="font-medium text-gray-700">{match.homeTeam.name}</span>
          </div>
          
          <div className="text-center mx-4">
            {match.status === "FINISHED" || match.status === "IN_PLAY" ? (
              <div className="text-xl font-bold text-gray-700">
                {match.score.fullTime.home} - {match.score.fullTime.away}
              </div>
            ) : (
              <div className="text-sm text-gray-500">vs</div>
            )}
          </div>
          
          <div className="flex items-center justify-end">
            <span className="font-medium text-gray-700">{match.awayTeam.name}</span>
            <div className="w-8 h-8 ml-3">
              {match.awayTeam.crest && (
                <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
        
        {match.competition && (
          <div className="mt-3 text-xs text-gray-600 flex items-center">
            <span>{match.competition.name}</span>
            {match.competition.emblem && (
              <img src={match.competition.emblem} alt={match.competition.name} className="w-4 h-4 ml-1" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}