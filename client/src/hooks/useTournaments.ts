import { useEffect, useState } from 'react'
import { request } from '../utils/request'

export interface Tournament {
  id: number
  name: string
  startDate: string
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly'
  description?: string
  createdAt: Date
  updatedAt: Date
}

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  useEffect(() => {
    request.get('/api/tournament').then(resp => setTournaments(resp.data))
  }, [])

  return tournaments
}
