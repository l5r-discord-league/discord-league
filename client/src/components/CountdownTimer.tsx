import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

export function CountdownTimer(props: { deadline: string; timeOutMessage: string }) {
  const deadlineDate = new Date(props.deadline)
  const [msg, setMsg] = useState(formatDistanceToNow(deadlineDate))

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMsg(formatDistanceToNow(deadlineDate))
    }, 60 * 1000)
    return () => clearTimeout(timeout)
  })

  if (deadlineDate > new Date()) {
    return <span>{msg}</span>
  }

  return <span>{props.timeOutMessage}</span>
}
