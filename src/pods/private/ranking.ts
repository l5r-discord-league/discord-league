import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { contramap, ordDate } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/function'
import { Player, Match } from './types'

interface MatchProps {
  id: number
  playerAId: number
  playerBId: number
  winnerId?: number
  updatedAt: Date
}

type MinimalPlayer = Pick<Player, 'id'>

class Wrapper {
  private matches: MatchProps[] = []
  public played = 0
  private constructor(private player: MinimalPlayer, allMatches: MatchProps[]) {
    allMatches.forEach((match) => {
      if (this.player.id === match.playerAId || this.player.id === match.playerBId) {
        this.matches.push(match)
        if (match.winnerId != null) {
          this.played += 1
        }
      }
    })
  }

  static wrapWithMatches(allMatches: MatchProps[]) {
    return <P extends MinimalPlayer>(player: P) => new Wrapper(player, allMatches)
  }

  static unwrap(wrapper: Wrapper): Player {
    return wrapper.player as Player
  }

  get id() {
    return this.player.id
  }

  get firstWinDate(): number {
    return pipe(
      this.matches,
      A.filter((match) => this.player.id === match.winnerId),
      A.sort(contramap<Date, MatchProps>((match) => match.updatedAt)(ordDate)),
      A.head,
      O.fold(
        () => Infinity,
        (match) => match.updatedAt.getTime()
      )
    )
  }

  winsAgainst(opponentIds: number[]): number {
    return this.matches.filter(
      (match) =>
        this.player.id === match.winnerId &&
        (opponentIds.includes(match.playerAId) || opponentIds.includes(match.playerBId))
    ).length
  }
}

const opponentIds = (allPlayers: Wrapper[], player: Wrapper) =>
  player.winsAgainst(allPlayers.map((anyPlayer) => anyPlayer.id).filter((id) => id !== player.id))

const splitByWins = (players: Wrapper[]): Wrapper[][] =>
  A.reduce<Wrapper, Wrapper[][]>(
    A.makeBy(players.length, () => []), // one win per opponent + one slot for 0 wins
    (byWins, player) =>
      pipe(
        byWins,
        A.modifyAt<Wrapper[]>(opponentIds(players, player), (byWins) => [...byWins, player]),
        O.getOrElse<Wrapper[][]>(() => [])
      )
  )(players)

const splitByGamesPlayed = (players: Wrapper[]) =>
  A.reduce<Wrapper, Wrapper[][]>(
    A.makeBy(players.length, () => []), // one possible game per opponent + one slot for 0 games
    (byPlayed, player) =>
      pipe(
        byPlayed,
        A.modifyAt<Wrapper[]>(player.played, (byPlayed) => [...byPlayed, player]),
        O.getOrElse<Wrapper[][]>(() => [])
      )
  )

const splitByFirstWin = (players: Wrapper[]) =>
  players
    .sort((playerA, playerB) => playerB.firstWinDate - playerA.firstWinDate)
    .map((player) => [player])

export function rankPodParticipants<P extends MinimalPlayer>(
  players: P[],
  matches: Match[]
): Player[] {
  const wrappers = players.map(Wrapper.wrapWithMatches(matches))

  return pipe(
    wrappers,
    splitByWins,
    A.chain(splitByGamesPlayed(wrappers)),
    A.chain(splitByWins),
    A.chain(splitByFirstWin),
    A.flatten,
    A.map(Wrapper.unwrap),
    A.reverse
  )
}
