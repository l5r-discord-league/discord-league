import * as A from 'fp-ts/lib/Array'
import { tuple } from 'fp-ts/lib/function'

import { Pod } from './types'

export const matchesForPod = (pod: Pod) =>
  A.comprehension([pod.participants, pod.participants], tuple, (a, b) => a.id < b.id)
