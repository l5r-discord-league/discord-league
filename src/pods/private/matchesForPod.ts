import * as A from 'fp-ts/lib/Array'
import { tuple } from 'fp-ts/lib/function'

import { Player, Pod } from './types'

/**
 * Returns all the matches for a Pod
 */
export const matchesForPod = (pod: Pod): [Player, Player][] =>
  A.comprehension([pod.players, pod.players], tuple, (a, b) => a.id < b.id)
