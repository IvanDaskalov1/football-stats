// components/MatchesCalendar.tsx – Семпъл компонент за календар
import React from 'react'
import dayjs from 'dayjs'  // (примерна библиотека за работа с дати)

type Match = { id: number; teamA: string; teamB: string; date: string; }
interface CalendarProps { matches: Match[] }

const MatchesCalendar: React.FC<CalendarProps> = ({ matches }) => {
  const startOfMonth = dayjs().startOf('month')
  const endOfMonth = dayjs().endOf('month')
  // Генерираме дни от началото до края на месеца
  const days: dayjs.Dayjs[] = []
  let day = startOfMonth.startOf('week')
  const endDay = endOfMonth.endOf('week')
  while (day.isBefore(endDay)) {
    days.push(day)
    day = day.add(1, 'day')
  }

  // Групираме мачовете по дата за лесен достъп
  const matchesByDate = matches.reduce((acc, match) => {
    const dateKey = dayjs(match.date).format('YYYY-MM-DD')
    acc[dateKey] = acc[dateKey] ? [...acc[dateKey], match] : [match]
    return acc
  }, {} as Record<string, Match[]>)

  return (
    <div className="grid grid-cols-7 gap-2 text-center">
      {['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map((d, i) => <div key={i} className="font-bold">{d}</div>)}
      {days.map(day => {
        const dateKey = day.format('YYYY-MM-DD')
        const dayMatches = matchesByDate[dateKey] || []
        return (
          <div key={dateKey} className={`p-2 border ${day.month() !== dayjs().month() ? 'bg-gray-100' : ''}`}>
            <div className="text-sm">{day.date()}</div>
            {dayMatches.map(match => (
              <div key={match.id} className="bg-blue-50 mt-1 p-1 rounded text-xs">
                {match.teamA} - {match.teamB}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default MatchesCalendar