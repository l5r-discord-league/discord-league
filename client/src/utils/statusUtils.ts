const tournamentStati = [
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'group', name: 'Group Stage' },
  { id: 'endOfGroup', name: 'Bracket Submission Stage' },
  { id: 'bracket', name: 'Bracket Stage' },
  { id: 'finished', name: 'Finished' },
]

export function getTournamentStatusForId(id: string): string {
  const status = tournamentStati.find((status) => status.id === id)
  return status ? status.name : 'Unknown Stage'
}
