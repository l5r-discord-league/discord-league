import * as A from 'fp-ts/lib/Array'
import { contramap, ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/function'

import challongeClient from '../../clients/challonge'
import * as db from '../../gateways/storage'
import { RankedParticipant } from '../../tournaments'

const winRatioDESC = contramap<number, RankedParticipant>((p) => -(p.wins / (p.wins + p.losses)))(
  ordNumber
)
const gamesPlayedDESC = contramap<number, RankedParticipant>((p) => -(p.wins + p.losses))(ordNumber)

export async function processBrackets(
  tournament: db.TournamentRecord,
  podResults: Array<{ participants: RankedParticipant[] }>,
  decklists: Array<{ participantId: number; locked: boolean }>
): Promise<void> {
  const [goldCupParticipants, silverCupParticipants] = pipe(
    podResults,
    A.chain((podResult) => podResult.participants),
    A.reduce<RankedParticipant, [RankedParticipant[], RankedParticipant[]]>(
      [[], []],
      (acc, participant) => {
        switch (participant.bracket) {
          case 'goldCup':
            return [[...acc[0], participant], acc[1]]
          case 'silverCup':
            return [acc[0], [...acc[1], participant]]
          default:
            return acc
        }
      }
    ),
    A.map(A.sortBy([winRatioDESC, gamesPlayedDESC])),
    A.map((participants) =>
      A.comprehension(
        [participants, decklists],
        (participant) => participant,
        (participant, decklist) => decklist.participantId === participant.id && decklist.locked
      )
    )
  )

  await Promise.all([
    createOnChallonge(tournament, 'Gold', goldCupParticipants),
    createOnChallonge(tournament, 'Silver', silverCupParticipants),
  ])
}

async function createOnChallonge(
  tournamentRecord: db.TournamentRecord,
  cup: 'Gold' | 'Silver',
  participants: RankedParticipant[]
) {
  if (participants.length === 0) {
    return null
  }

  const challongeTournamentNotStarted = await challongeClient.createTournament({
    name: `${cup} Cup - ${tournamentRecord.name}`,
    tournament_type: 'single elimination',
    accept_attachments: true,
    show_rounds: true,
  })

  await challongeClient.addParticipantsToTournament(
    challongeTournamentNotStarted.id,
    participants.map((p) => ({
      name: nameInChallongeBracket(p),
      misc: `participantId: ${p.id}`,
    }))
  )

  const challongeTournament = await challongeClient.startTournament(
    challongeTournamentNotStarted.id
  )

  return db.createBracket({
    bracket: cup === 'Gold' ? 'goldCup' : 'silverCup',
    tournamentId: tournamentRecord.id,
    challongeTournamentId: challongeTournament.id,
    url: challongeTournament.url,
  })
}

function nameInChallongeBracket(p: RankedParticipant) {
  return `${clanEmoji(p.clanId)} - ${p.discordName}#${p.discordDiscriminator}`
}

function clanEmoji(clanId: number) {
  switch (clanId) {
    case 1:
      return '🦀'
    case 2:
      return '🦢'
    case 3:
      return '🐉'
    case 4:
      return '🦁'
    case 5:
      return '🐣'
    case 6:
      return '🦂'
    case 7:
      return '🦄'
    default:
      return ''
  }
}
