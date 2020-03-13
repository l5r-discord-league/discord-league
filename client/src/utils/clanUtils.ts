export const clans: { index: number; name: string }[] = [
  { index: 1, name: 'Crab' },
  { index: 2, name: 'Crane' },
  { index: 3, name: 'Dragon' },
  { index: 4, name: 'Lion' },
  { index: 5, name: 'Phoenix' },
  { index: 6, name: 'Scorpion' },
  { index: 7, name: 'Unicorn' },
]

export function getClanForId(id?: number): string | undefined {
  let value
  if (id) {
    value = clans.find(clan => clan.index === id)?.name
  }
  return value || ''
}
