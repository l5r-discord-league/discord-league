import { ParticipantRecord } from '../gateways/storage'

/*
function getPodSizes(n: number): number[] {
  if (n === 7 || n === 8) {
    return [n]
  }

  const y = []
  while (n > 0) {
    y.push(8)
    n = n - 8
  }

  n = -n
  if (n > y.length) {
    throw Error('Math is hard')
  }

  for (let idx = y.length - 1; n > 0; n-- && idx--) {
    // eslint-disable-next-line security/detect-object-injection
    y[idx] = y[idx] - 1
  }

  return y
}
*/

function canBeDecomposedIn7sAnd8s(n: number) {
  for (let x = 0, mx = Math.floor(n / 8); x <= mx; x++) {
    for (let y = 0, my = Math.floor(n / 7); y <= my; y++) {
      if (n === 8 * x + 7 * y) {
        return true
      }
    }
  }

  return false
}

type Pod = ParticipantRecord[]
export function groupParticipantsInPods(participants: ParticipantRecord[]): Pod[] {
  const byTimezone = participants.reduce<Record<number, ParticipantRecord[]>>(
    (acc, participant) => {
      if (!(participant.timezoneId in acc)) {
        acc[participant.timezoneId] = []
      }
      acc[participant.timezoneId].push(participant)
      return acc
    },
    {}
  )

  // if (!canBeDecomposedIn7sAnd8s(participants.length)) {
  //   throw Error(`Cannot create pods for for ${participants.length} players`)
  // }
  return Object.values(byTimezone)
    .map(participants => {
      const podCount = Math.ceil(participants.length / 8)
      return participants.reduce<Pod[]>((pods, participant, idx) => {
        /* eslint-disable security/detect-object-injection */
        const podNumber = idx % podCount

        if (pods[podNumber] == null) {
          pods[podNumber] = []
        }
        pods[podNumber].push(participant)

        return pods
        /* eslint-enable security/detect-object-injection */
      }, [])
    })
    .reduce((a, b) => [...a, ...b])
}
