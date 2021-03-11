export const victoryConditions: { index: number; name: string }[] = [
  { index: 1, name: 'Stronghold Break' },
  { index: 2, name: 'Dishonor Victory' },
  { index: 3, name: 'Honor Victory' },
  { index: 4, name: 'Concession' },
  { index: 6, name: 'Enlightenment Victory' },
  { index: 5, name: 'No Opponent/No Show' },
]

export function getVictoryConditionForId(id?: number): string {
  return victoryConditions.find((victoryCondition) => victoryCondition.index === id)?.name ?? ''
}
