// components/PredictionForm.tsx – Форма за подаване на прогноза
import React, { useState } from 'react'

interface PredictionFormProps { matches: { id: number; vs: string; }[] }

const PredictionForm: React.FC<PredictionFormProps> = ({ matches }) => {
  const [matchId, setMatchId] = useState<number>(matches[0]?.id || 0)
  const [predictedScore, setPredictedScore] = useState<string>('')

  const submitPrediction = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, predictedScore })
    })
    // TODO: Обработка на отговора или обновяване на класацията
  }

  return (
    <form onSubmit={submitPrediction} className="max-w-md p-4 bg-gray-50 rounded">
      <label className="block mb-2">
        Мач:
        <select 
          value={matchId} 
          onChange={e => setMatchId(Number(e.target.value))} 
          className="block w-full mt-1 p-2 border"
        >
          {matches.map(m => (
            <option key={m.id} value={m.id}>{m.vs}</option>
          ))}
        </select>
      </label>
      <label className="block mb-2">
        Прогнозиран резултат:
        <input 
          type="text" 
          value={predictedScore} 
          onChange={e => setPredictedScore(e.target.value)} 
          className="block w-full mt-1 p-2 border" 
          placeholder="напр. 2:1"
          required 
        />
      </label>
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
        Изпрати прогноза
      </button>
    </form>
  )
}

export default PredictionForm