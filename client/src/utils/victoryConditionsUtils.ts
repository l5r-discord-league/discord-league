export const victoryConditions: { index: number; name: string }[] = [
  { index: 1, name: 'Stronghold Break' },
  { index: 2, name: 'Dishonor Victory' },
  { index: 3, name: 'Honor Victory' },
  { index: 4, name: 'Concession' },
  // TODO
  { index: 5, name: 'W.O.' },
  { index: 6, name: 'Enlightenment Victory' },
]

export function getVictoryConditionForId(id?: number): string | undefined {
  let value
  if (id) {
    value = victoryConditions.find(victoryCondition => victoryCondition.index === id)?.name
  }
  return value || ''
}
