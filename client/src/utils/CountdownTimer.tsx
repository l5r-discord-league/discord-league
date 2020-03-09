import React, { useState, useEffect } from 'react'
import { String } from 'typescript-string-operations'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(deadline: Date): TimeLeft {
  const difference: number = deadline.getTime() - Date.now()

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
}

export function CountdownTimer(props: { deadline: Date; timeOutMessage: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(props.deadline))

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(props.deadline))
    }, 1000)
    return () => clearTimeout(timeout)
  })

  return props.deadline > new Date() ? (
    <span>{String.Format('in {days}:{hours:00}:{minutes:00}:{seconds:00}', timeLeft)}</span>
  ) : (
    <span>{props.timeOutMessage}</span>
  )
}
