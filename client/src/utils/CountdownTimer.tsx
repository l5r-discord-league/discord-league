import React, { useState, useEffect } from 'react'

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

export function CountdownTimer(props: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(props.deadline))

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(props.deadline))
    }, 1000)
    return () => clearTimeout(timeout)
  })

  let timeString = ''

  if (timeLeft.days) {
    timeString += `${timeLeft.days} days, `
  }
  if (timeLeft.hours) {
    timeString += `${timeLeft.hours} hours, `
  }
  if (timeLeft.minutes) {
    timeString += `${timeLeft.minutes} minutes, `
  }
  if (timeLeft.seconds) {
    timeString += `${timeLeft.seconds} seconds`
  }

  return timeString !== '' ? <span>in {timeString.trimRight()}</span> : <span>Time's up!</span>
}
