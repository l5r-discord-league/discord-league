import { testProp, fc } from 'ava-fast-check'
import { rankPodParticipants } from './ranking'
import { Player } from './types'
import * as arbitrary from './__test_helpers'

function uniqueIds(players: Player[]) {
  const ids = players.map((p) => p.id)
  return ids.length === new Set(ids).size
}

testProp(
  'dropped always comes last',
  [
    fc
      .tuple(arbitrary.player({ dropped: true }), arbitrary.player({ dropped: false }))
      .filter(uniqueIds)
      .chain(([pa, pb]) =>
        fc.tuple(
          fc.constant([pa, pb]),
          arbitrary.match({ playerAId: pa.id, playerBId: pb.id, winnerId: pa.id })
        )
      ),
  ],
  ([players, matches]) => {
    const ranking = rankPodParticipants(players, [matches])
    console.log({ players, matches, ranking })
    return ranking[0].id === players[1].id && ranking[1].id === players[0].id
  }
)

testProp(
  'more wins first',
  [
    fc
      .tuple(arbitrary.player({ dropped: false }), arbitrary.player({ dropped: false }))
      .filter(uniqueIds)
      .chain(([pa, pb]) =>
        fc.tuple(
          fc.constant([pa, pb]),
          arbitrary.match({ playerAId: pa.id, playerBId: pb.id, winnerId: pa.id })
        )
      ),
  ],
  ([players, matches]) => {
    const ranking = rankPodParticipants(players, [matches])
    return ranking[0].id === players[0].id && ranking[1].id === players[1].id
  }
)

testProp(
  'games played is 2nd criteria',
  [
    fc
      .tuple(
        arbitrary.player({ dropped: false }),
        arbitrary.player({ dropped: false }),
        arbitrary.player({ dropped: false })
      )
      .filter(uniqueIds)
      .chain(([pa, pb, pc]) =>
        fc.tuple(
          fc.constant([pa, pb, pc]),
          fc.tuple(
            arbitrary.match({ playerAId: pa.id, playerBId: pb.id, winnerId: pa.id }),
            arbitrary.match({ playerAId: pa.id, playerBId: pc.id, winnerId: undefined }),
            arbitrary.match({ playerAId: pb.id, playerBId: pc.id, winnerId: pb.id })
          )
        )
      ),
  ],
  ([players, matches]) => {
    const [pa, pb, pc] = players
    const ranking = rankPodParticipants(players, matches)
    return ranking[0].id === pb.id && ranking[1].id === pa.id && ranking[2].id === pc.id
  }
)

testProp(
  'head to head is 3rd criteria',
  [
    fc
      .tuple(
        arbitrary.player({ dropped: false }),
        arbitrary.player({ dropped: false }),
        arbitrary.player({ dropped: false }),
        arbitrary.player({ dropped: false })
      )
      .filter(uniqueIds)
      .chain(([pa, pb, pc, pd]) =>
        fc.tuple(
          fc.constant([pa, pb, pc, pd]),
          fc.tuple(
            arbitrary.match({ playerAId: pa.id, playerBId: pb.id, winnerId: pa.id }),
            arbitrary.match({ playerAId: pa.id, playerBId: pc.id, winnerId: pa.id }),
            arbitrary.match({ playerAId: pa.id, playerBId: pd.id, winnerId: pd.id }),
            arbitrary.match({ playerAId: pb.id, playerBId: pc.id, winnerId: pb.id }),
            arbitrary.match({ playerAId: pb.id, playerBId: pd.id, winnerId: pb.id }),
            arbitrary.match({ playerAId: pc.id, playerBId: pd.id, winnerId: pc.id })
          )
        )
      ),
  ],
  ([players, matches]) => {
    const [pa, pb, pc, pd] = players
    const ranking = rankPodParticipants(players, matches)
    return (
      ranking[0].id === pa.id &&
      ranking[1].id === pb.id &&
      ranking[2].id === pc.id &&
      ranking[3].id === pd.id
    )
  }
)

testProp(
  'first win is 4th criteria',
  [
    fc
      .tuple(
        arbitrary.player({ dropped: false }),
        arbitrary.player({ dropped: false }),
        arbitrary.player({ dropped: false })
      )
      .filter(uniqueIds)
      .chain(([pa, pb, pc]) =>
        fc.tuple(
          fc.constant([pa, pb, pc]),
          fc.tuple(
            arbitrary.match({
              playerAId: pa.id,
              playerBId: pb.id,
              winnerId: pa.id,
              updatedAt: new Date('2021-01-03'),
            }),
            arbitrary.match({
              playerAId: pa.id,
              playerBId: pc.id,
              winnerId: pc.id,
              updatedAt: new Date('2021-01-02'),
            }),
            arbitrary.match({
              playerAId: pb.id,
              playerBId: pc.id,
              winnerId: pb.id,
              updatedAt: new Date('2021-01-01'),
            })
          )
        )
      ),
  ],
  ([players, matches]) => {
    const [pa, pb, pc] = players
    const ranking = rankPodParticipants(players, matches)
    return ranking[0].id === pb.id && ranking[1].id === pc.id && ranking[2].id === pa.id
  }
)
