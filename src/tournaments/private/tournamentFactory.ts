import { MonthlyTournament } from './monthly'
import { Pod6Tournament } from './pod6'
import { TournamentData, PodData, MatchData, ParticipantData } from './types'

export function toTournament(
  tournament: TournamentData,
  pods: PodData[],
  matches: MatchData[],
  participants: ParticipantData[]
): MonthlyTournament | Pod6Tournament {
  switch (tournament.typeId) {
    case 'monthly':
      return new MonthlyTournament(tournament, pods, matches, participants)
    case 'pod6':
      return new Pod6Tournament(tournament, pods, matches, participants)
  }
}
