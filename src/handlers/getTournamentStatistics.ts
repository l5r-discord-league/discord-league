import { Tournament$findStatistics } from '@dl/api'
import { Request, Response } from 'express'
import * as A from 'fp-ts/lib/Array'

import * as db from '../gateways/storage'
import { kamiRanking } from '../statistics'

interface Match {
  playerAId: number
  playerBId: number
  winnerId?: number
  victoryConditionId?: number
  deckAClanId?: number
  deckBClanId?: number
}

interface ValidMatch {
  playerAId: number
  playerBId: number
  winnerId: number
  victoryConditionId: number
  deckAClanId: number
  deckBClanId: number
}

function isValidMatch(m: Match | ValidMatch): m is ValidMatch {
  return (
    m.winnerId != null &&
    m.playerAId != null &&
    m.playerBId != null &&
    m.victoryConditionId != null &&
    m.deckAClanId != null &&
    m.deckBClanId != null
  )
}

export async function handler(
  req: Request<Tournament$findStatistics['request']['params']>,
  res: Response<Tournament$findStatistics['response']>
): Promise<void> {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.sendStatus(400)
    return
  }

  const tournamentRecord = await db.getTournament(tournamentId)
  if (!tournamentRecord) {
    res.sendStatus(404)
    return
  }

  const matches = await db.fetchMatchesForTournament(tournamentRecord.id)
  const validMatches = A.filter(isValidMatch)(matches)
  const rawRanking = kamiRanking(validMatches)
  const ranking = rawRanking
    .sort(([, powerA], [, powerB]) => -(powerA - powerB))
    .map(([clanId, kamiPower]) => [clanId, Math.round(kamiPower * 7 * 100 - 100)])

  res.status(200).send({ ranking })
}
