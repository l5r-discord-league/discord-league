import { RankedParticipant } from '@dl/api'
import { Typography } from '@material-ui/core'
import { PlayersPieChart } from './PlayersPieChart'
import { useTournamentStatistics } from '../hooks/useTournamentStatistics'
import { Loading } from './Loading'
import { RequestError } from './RequestError'
import { EmptyState } from './EmptyState'
import { ClanMon } from './ClanMon/ClanMon'

function Row(props: { clanId: number; kamiPower: number }) {
  return (
    <div style={{ marginTop: 10 }}>
      <Typography variant="h6">
        <ClanMon clanId={props.clanId} />
        {` ${props.kamiPower}% chance of winning a tournament`}
      </Typography>
    </div>
  )
}

export function TournamentStatistics(props: {
  tournamentId: number
  participants: RankedParticipant[]
}) {
  const [data] = useTournamentStatistics(props.tournamentId)
  if (data.loading) {
    return <Loading />
  }
  if (data.error) {
    return <RequestError requestError={data.error} />
  }
  if (data.data == null) {
    return <EmptyState />
  }
  return (
    <>
      <Typography variant="h4" align="center">
        Tournament Statistics
      </Typography>

      <div style={{ margin: '10px 15px 0' }}>
        <Typography variant="h5" align="center">
          Kami Ranking
        </Typography>
        <Typography>
          This ranking takes in account the matchups for each clan, and how those matchups
          themselves balance against the field. Having a spread of good matchups is better than
          having a few heavily favored matchups, but being bad in other matchups. Clans also ranks
          higher when they are strong against other strong clans, and lose more points when having a
          bad matchup against a top clan. It is named after the Tournament of the Kami. To read more
          on how the Kami Ranking is calculated{' '}
          <a href="/kami-ranking.pdf" download>
            check this document.
          </a>
        </Typography>
        <br />
        {data.data.ranking.map(([clanId, kamiPower]) => (
          <Row key={clanId} clanId={clanId} kamiPower={kamiPower} />
        ))}
      </div>

      <div>
        <Typography variant="h5" align="center">
          Signups
        </Typography>
        <PlayersPieChart participants={props.participants} />
      </div>
    </>
  )
}
