export const clans: { clanId: number; name: string; color: string }[] = [
  { clanId: 1, name: 'Crab', color: '#163078' },
  { clanId: 2, name: 'Crane', color: '#44c2bc' },
  { clanId: 3, name: 'Dragon', color: '#1d6922' },
  { clanId: 4, name: 'Lion', color: '#dece23' },
  { clanId: 5, name: 'Phoenix', color: '#de9923' },
  { clanId: 6, name: 'Scorpion', color: '#ab1916' },
  { clanId: 7, name: 'Unicorn', color: '#90119e' },
]

export function getClanForId(id?: number): string | undefined {
  let value
  if (id) {
    value = clans.find((clan) => clan.clanId === id)?.name
  }
  return value || ''
}
