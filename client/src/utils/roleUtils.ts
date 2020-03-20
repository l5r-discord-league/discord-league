export const roles: { index: number; name: string }[] = [
  { index: 1, name: 'Keeper of Air' },
  { index: 2, name: 'Keeper of Earth' },
  { index: 3, name: 'Keeper of Fire' },
  { index: 4, name: 'Keeper of Void' },
  { index: 5, name: 'Keeper of Water' },
  { index: 6, name: 'Seeker of Air' },
  { index: 7, name: 'Seeker of Earth' },
  { index: 8, name: 'Seeker of Fire' },
  { index: 9, name: 'Seeker of Void' },
  { index: 10, name: 'Seeker of Water' },
  { index: 11, name: 'Support of the Crab' },
  { index: 12, name: 'Support of the Crane' },
  { index: 13, name: 'Support of the Dragon' },
  { index: 14, name: 'Support of the Lion' },
  { index: 15, name: 'Support of the Phoenix' },
  { index: 16, name: 'Support of the Scorpion' },
  { index: 17, name: 'Support of the Unicorn' },
]

export function getRoleForId(id?: number): string | undefined {
  let value
  if (id) {
    value = roles.find(role => role.index === id)?.name
  }
  return value || ''
}
