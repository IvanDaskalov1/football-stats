// components/MatchCard.tsx – Компонент за показване на един мач
import React from 'react'
type Match = { teamA: string; teamB: string; date: string; score?: string; }

const MatchCard: React.FC<{ match: Match }> = ({ match }) => (
  <li className="border rounded-lg p-4 mb-2 flex justify-between items-center">
    <div>
      <div className="font-semibold">{match.teamA} vs {match.teamB}</div>
      <div className="text-sm text-gray-600">{match.date}</div>
    </div>
    <div className="text-lg">
      {match.score ? <span className="text-green-600">{match.score}</span> : <span className="text-gray-500">-:-</span>}
    </div>
  </li>
)

export default MatchCard