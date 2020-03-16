import { useEffect, useState } from 'react'
import { request } from '../utils/request'
import { RowUser, useUsers } from './useUsers'

export interface ParticipantWithUserData {
  userData: RowUser
  clanId: number
  timezoneId: number
  timezonePreferenceId: string
  participationId: number
}

interface ParticipantRecord {
  id: number
  userId: string
  clanId: number
  tournamentId: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
}

export function useTournamentParticipants(id: number): ParticipantWithUserData[] {
  const users = useUsers()
  const [records, setRecords] = useState<ParticipantRecord[]>([])
  const [participants, setParticipants] = useState<ParticipantWithUserData[]>([])

  function mergeParticipants(records: ParticipantRecord[], users: RowUser[]) {
    const merged: ParticipantWithUserData[] = records.map<ParticipantWithUserData>(record => {
      console.log(users)
      console.log(record.userId)
      const user = users.find(rowUser => rowUser.userId === record.userId)
      if (user) {
        return {
          userData: user,
          clanId: record.clanId,
          timezoneId: record.timezoneId,
          timezonePreferenceId: record.timezonePreferenceId,
          participationId: record.id,
        }
      }
      throw Error('No user with ID ' + record.userId + ' found!')
    })
    setParticipants(merged)
  }

  useEffect(() => {
    request.get('/api/tournament/' + id + '/participant').then(resp => setRecords(resp.data))
  })

  if (records.length > 0 && users.length > 0) {
    mergeParticipants(records, users)
  }

  return participants
}
