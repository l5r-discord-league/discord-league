interface Match_ {
  id: number
  playerAId: number
  playerBId: number
  winnerId: number | null
  [key: string]: unknown
}
interface Player_ {
  id: number
  dropped: boolean
  [key: string]: unknown
}
interface Return {
  drop: number[]
  doubleLoss: number[]
}

const DOUBLE_LOSS = -1

function dropPlayers(
  minPlayed: number,
  [oldPlayers, oldMatches]: [Player_[], Match_[]]
): [Player_[], Match_[]] {
  const newPlayers = oldPlayers.map(p => ({
    ...p,
    dropped:
      p.dropped ||
      oldMatches.filter(m => (p.id === m.playerAId || p.id === m.playerBId) && m.winnerId != null)
        .length < minPlayed,
  }))
  const droppedIds = newPlayers.filter(p => p.dropped).map(p => p.id)
  const newMatches = oldMatches.map(m => ({
    ...m,
    winnerId:
      droppedIds.includes(m.playerAId) && droppedIds.includes(m.playerBId)
        ? DOUBLE_LOSS
        : droppedIds.includes(m.playerAId)
        ? m.playerBId
        : droppedIds.includes(m.playerBId)
        ? m.playerAId
        : m.winnerId,
  }))
  return [newPlayers, newMatches]
}

export function closePod(players: Player_[], matches: Match_[]): Return {
  if (players.length === 0 || matches.length === 0) {
    throw Error('Must be non empty')
  }

  let afterAutoDrop: [Player_[], Match_[]] = [players, matches]
  for (let dropThreshold = players.length - 1 - 2, i = 1; i <= dropThreshold; i++) {
    afterAutoDrop = dropPlayers(i, afterAutoDrop)
  }

  return {
    drop: afterAutoDrop[0].flatMap(p => (p.dropped ? p.id : [])),
    doubleLoss: afterAutoDrop[1].flatMap(m =>
      m.winnerId == null || m.winnerId === DOUBLE_LOSS ? m.id : []
    ),
  }
}
