import * as A from 'fp-ts/lib/Array'
import { tuple } from 'fp-ts/lib/function'

import { Pod } from './groupParticipantsInPods'

export const matchesForPod = (pod: Pod) => A.comprehension([pod, pod], tuple, (a, b) => a.id < b.id)
