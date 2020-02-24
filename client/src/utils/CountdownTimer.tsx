import React, { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer(props: { deadline: Date }) {
  function calculateTimeLeft(): TimeLeft {
    const difference: number = props.deadline.getTime() - Date.now()

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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

  const timerComponents = []

  if (timeLeft.days) {
    timerComponents.push(<span>{timeLeft.days} days, </span>)
  }
  if (timeLeft.hours) {
    timerComponents.push(<span>{timeLeft.hours} hours, </span>)
  }
  if (timeLeft.days) {
    timerComponents.push(<span>{timeLeft.minutes} minutes, </span>)
  }
  if (timeLeft.days) {
    timerComponents.push(<span>{timeLeft.seconds} seconds</span>)
  }

  return <span>{timerComponents.length ? timerComponents : <span>Time's up!</span>}</span>
}
