"use client"

import React, { useState, useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import dayjs from "dayjs"
import styles from "./CalendarComponent.module.css" // Import custom styles
import { Match } from "@/types"

interface CalendarComponentProps {
  matches: Match[]
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

export default function CalendarComponent({ 
  matches = [],
  selectedDate, 
  onDateSelect 
}: CalendarComponentProps) {
  // Create a Set of match dates for quick lookup
  const matchDates = new Set(
    (matches || []).map(match => dayjs(match.utcDate).format("YYYY-MM-DD"))
  )

  // Custom tile class for dates with matches
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null
    
    const dateStr = dayjs(date).format("YYYY-MM-DD")
    return matchDates.has(dateStr) ? styles.matchDay : null
  }

  return (
    <div className="calendar-container">
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) {
            onDateSelect(value);
          }
        }}
        value={selectedDate}
        tileClassName={getTileClassName}
        className={styles.calendar}
      />
      <div className="mt-3 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Dates with matches</span>
        </div>
      </div>
    </div>
  )
}