export function getTournamentStatusForId(id: string): string {
  switch (id) {
    case 'upcoming':
      return 'Upcoming'
    case 'group':
      return 'Group Stage'
    case 'endOfGroup':
      return 'Bracket Submission Stage'
    case 'bracket':
      return 'Bracket Stage'
    case 'finished':
      return 'Finished'
    default:
      return ''
  }
}
