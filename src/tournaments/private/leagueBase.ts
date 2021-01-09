import {
  TournamentData,
  PodData,
  MatchData,
  ParticipantData,
  PlayerRecord,
  PodResult,
  ExtendedParticipant,
  RankedParticipant,
} from './types'

export abstract class LeagueBase {
  constructor(
    protected tournament: TournamentData,
    protected pods: PodData[],
    protected matches: MatchData[],
    protected participants: ParticipantData[]
  ) {}

  private getMatches(pod: PodData): MatchData[] {
    return this.matches.filter((match) => match.podId === pod.id)
  }

  private getParticipants(pod: PodData): ParticipantData[] {
    return this.participants.filter((participant) =>
      this.matches.some(
        (match) =>
          match.podId === pod.id &&
          (participant.id === match.playerAId || participant.id === match.playerBId)
      )
    )
  }

  protected get isPodStageDone(): boolean {
    return (
      this.tournament.statusId === 'endOfGroup' ||
      this.tournament.statusId === 'bracket' ||
      this.tournament.statusId === 'finished'
    )
  }

  protected abstract playerRecordReduce(
    records: Record<number, PlayerRecord>,
    match: MatchData
  ): Record<number, PlayerRecord>

  protected calcRecords(
    podParticipants: ParticipantData[],
    podMatches: MatchData[]
  ): PlayerRecord[] {
    return Object.values(
      podMatches.reduce(
        (records: Record<number, PlayerRecord>, match: MatchData) =>
          this.playerRecordReduce(records, match),
        podParticipants.reduce<Record<number, PlayerRecord>>(
          (initialRecords, player) => ({
            ...initialRecords,
            [player.id]: { participantId: player.id, dropped: player.dropped, wins: 0, losses: 0 },
          }),
          {}
        )
      )
    )
  }

  protected abstract rankParticipants(
    extendedParticipants: ExtendedParticipant[],
    matches: MatchData[]
  ): RankedParticipant[]

  public toPodResults(): PodResult[] {
    return this.pods.map((pod) => {
      const matches = this.getMatches(pod)
      const participants = this.getParticipants(pod)
      const records = this.calcRecords(participants, matches)
      const extendedParticipants = participants.map((participant) => ({
        ...participant,
        ...(records.find((record) => participant.id === record.participantId) ?? {
          wins: 0,
          losses: 0,
          participantId: participant.id,
        }),
      }))
      const rankedParticipants = this.rankParticipants(extendedParticipants, matches)

      return { ...pod, matches, participants: rankedParticipants }
    })
  }
}
