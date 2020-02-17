import { TournamentStatus } from './tournamentStatus'

export class Tournament {
  constructor(public id: string, public name: string, public status = TournamentStatus.Upcoming) {}
}
