import { fc, test, testProp } from 'ava-fast-check'
import { closePods } from './closePods'

test('is a function', t => {
  t.is(typeof closePods, 'function')
})

test('requires non empty array of participants and matches', t => {
  t.throws(() => closePods([], []))
})

test('no matches played, drop everybody', t => {
  const participants = [
    { id: 1, dropped: false },
    { id: 2, dropped: false },
    { id: 3, dropped: false },
    { id: 4, dropped: false },
    { id: 5, dropped: false },
    { id: 6, dropped: false },
    { id: 7, dropped: false },
    { id: 8, dropped: false },
  ]
  const matches = [
    { id: 1, playerAId: 1, playerBId: 2, winnerId: null },
    { id: 2, playerAId: 1, playerBId: 3, winnerId: null },
    { id: 3, playerAId: 1, playerBId: 4, winnerId: null },
    { id: 4, playerAId: 1, playerBId: 5, winnerId: null },
    { id: 5, playerAId: 1, playerBId: 6, winnerId: null },
    { id: 6, playerAId: 1, playerBId: 7, winnerId: null },
    { id: 7, playerAId: 1, playerBId: 8, winnerId: null },
    { id: 8, playerAId: 2, playerBId: 3, winnerId: null },
    { id: 9, playerAId: 2, playerBId: 4, winnerId: null },
    { id: 10, playerAId: 2, playerBId: 5, winnerId: null },
    { id: 11, playerAId: 2, playerBId: 6, winnerId: null },
    { id: 12, playerAId: 2, playerBId: 7, winnerId: null },
    { id: 13, playerAId: 2, playerBId: 8, winnerId: null },
    { id: 14, playerAId: 3, playerBId: 4, winnerId: null },
    { id: 15, playerAId: 3, playerBId: 5, winnerId: null },
    { id: 16, playerAId: 3, playerBId: 6, winnerId: null },
    { id: 17, playerAId: 3, playerBId: 7, winnerId: null },
    { id: 18, playerAId: 3, playerBId: 8, winnerId: null },
    { id: 19, playerAId: 4, playerBId: 5, winnerId: null },
    { id: 20, playerAId: 4, playerBId: 6, winnerId: null },
    { id: 21, playerAId: 4, playerBId: 7, winnerId: null },
    { id: 22, playerAId: 4, playerBId: 8, winnerId: null },
    { id: 23, playerAId: 5, playerBId: 6, winnerId: null },
    { id: 24, playerAId: 5, playerBId: 7, winnerId: null },
    { id: 25, playerAId: 5, playerBId: 8, winnerId: null },
    { id: 26, playerAId: 6, playerBId: 7, winnerId: null },
    { id: 27, playerAId: 6, playerBId: 8, winnerId: null },
    { id: 28, playerAId: 7, playerBId: 8, winnerId: null },
  ]
  t.deepEqual(closePods(participants, matches), {
    drop: [1, 2, 3, 4, 5, 6, 7, 8],
    doubleLoss: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
    ],
  })
})

test('players 1 and 2 played no matches, drop them. players 7 and 8 did not play their match, double loss them', t => {
  const participants = [
    { id: 1, dropped: true }, // Dropped during tournament
    { id: 2, dropped: false }, // Played no matches
    { id: 3, dropped: false }, // Missed 3 matches against players who played all the other games
    { id: 4, dropped: false },
    { id: 5, dropped: false },
    { id: 6, dropped: false },
    { id: 7, dropped: false },
    { id: 8, dropped: false },
  ]
  const matches = [
    { id: 1, playerAId: 1, playerBId: 2, winnerId: null },
    { id: 2, playerAId: 1, playerBId: 3, winnerId: null },
    { id: 3, playerAId: 1, playerBId: 4, winnerId: null },
    { id: 4, playerAId: 1, playerBId: 5, winnerId: null },
    { id: 5, playerAId: 1, playerBId: 6, winnerId: null },
    { id: 6, playerAId: 1, playerBId: 7, winnerId: null },
    { id: 7, playerAId: 1, playerBId: 8, winnerId: null },
    { id: 8, playerAId: 2, playerBId: 3, winnerId: null },
    { id: 9, playerAId: 2, playerBId: 4, winnerId: null },
    { id: 10, playerAId: 2, playerBId: 5, winnerId: null },
    { id: 11, playerAId: 2, playerBId: 6, winnerId: null },
    { id: 12, playerAId: 2, playerBId: 7, winnerId: null },
    { id: 13, playerAId: 2, playerBId: 8, winnerId: null },
    { id: 14, playerAId: 3, playerBId: 4, winnerId: 4 },
    { id: 15, playerAId: 3, playerBId: 5, winnerId: 5 },
    { id: 16, playerAId: 3, playerBId: 6, winnerId: null },
    { id: 17, playerAId: 3, playerBId: 7, winnerId: null },
    { id: 18, playerAId: 3, playerBId: 8, winnerId: null },
    { id: 19, playerAId: 4, playerBId: 5, winnerId: 5 },
    { id: 20, playerAId: 4, playerBId: 6, winnerId: 6 },
    { id: 21, playerAId: 4, playerBId: 7, winnerId: 7 },
    { id: 22, playerAId: 4, playerBId: 8, winnerId: 8 },
    { id: 23, playerAId: 5, playerBId: 6, winnerId: 6 },
    { id: 24, playerAId: 5, playerBId: 7, winnerId: 7 },
    { id: 25, playerAId: 5, playerBId: 8, winnerId: 8 },
    { id: 26, playerAId: 6, playerBId: 7, winnerId: 7 },
    { id: 27, playerAId: 6, playerBId: 8, winnerId: 8 },
    { id: 28, playerAId: 7, playerBId: 8, winnerId: null },
  ]
  t.deepEqual(closePods(participants, matches), {
    drop: [1, 2, 3],
    doubleLoss: [1, 2, 8, 28],
  })
})
