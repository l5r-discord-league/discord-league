export const timezones: { id: number; timezone: string }[] = [
  { id: 1, timezone: 'UTC-12 to UTC-8' },
  { id: 2, timezone: 'UTC-7 to UTC-5' },
  { id: 3, timezone: 'UTC-4 to UTC-2' },
  { id: 4, timezone: 'UTC-1 to UTC+1' },
  { id: 5, timezone: 'UTC+2 to UTC+4' },
  { id: 6, timezone: 'UTC+5 to UTC+7' },
  { id: 7, timezone: 'UTC+8 to UTC+12' },
]

export const timezonePreferences: { id: string; name: string }[] = [
  {
    id: 'similar',
    name: 'Yes',
  },
  {
    id: 'neutral',
    name: "Don't care",
  },
  {
    id: 'dissimilar',
    name: 'No',
  },
]

export function getTimezoneForId(id: number): string {
  return timezones.find((timezone) => timezone.id === id)?.timezone || 'No valid timezone'
}

export function getTimezonePreferenceForId(id: string): string {
  return (
    timezonePreferences.find((preference) => preference.id === id)?.name ||
    'No valid timezone preference'
  )
}
