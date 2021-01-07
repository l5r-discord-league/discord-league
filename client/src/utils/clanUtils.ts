export const clans: { index: number; name: string; color: string }[] = [
  { index: 1, name: 'Crab', color: '#163078' },
  { index: 2, name: 'Crane', color: '#44c2bc' },
  { index: 3, name: 'Dragon', color: '#1d6922' },
  { index: 4, name: 'Lion', color: '#dece23' },
  { index: 5, name: 'Phoenix', color: '#de9923' },
  { index: 6, name: 'Scorpion', color: '#ab1916' },
  { index: 7, name: 'Unicorn', color: '#90119e' },
]

export function getClanForId(id?: number): string | undefined {
  let value
  if (id) {
    value = clans.find((clan) => clan.index === id)?.name
  }
  return value || ''
}
