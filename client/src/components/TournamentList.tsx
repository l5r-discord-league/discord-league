import { Card, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { Tournament } from '../api'
import { getTournamentStatusForId } from '../utils/statusUtils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(2),
      position: 'relative',
      marginBottom: theme.spacing(1),
      cursor: 'pointer',
    },
    group: {
      marginBottom: theme.spacing(3),
    },
    header: {
      marginBottom: theme.spacing(2),
    },
  })
)

const TournamentItem = React.memo(
  ({ tournament, className }: { tournament: Tournament; className: string }) => {
    const history = useHistory()
    const startDate = new Date(tournament.startDate)
    return (
      <Card
        className={className}
        onClick={() => history.push(`/tournament/${tournament.id}`)}
        key={tournament.id}
      >
        <Typography variant="h5">
          {tournament.name} ({getTournamentStatusForId(tournament.statusId)})
        </Typography>
        <Typography>
          {`${
            startDate.getTime() > Date.now() ? 'Starts' : 'Started'
          } ${formatDistanceToNow(startDate, { addSuffix: true })}`}
        </Typography>
      </Card>
    )
  }
)

export function TournamentList(props: { label: string; tournaments: Tournament[] }) {
  const classes = useStyles()

  return (
    <div className={classes.group}>
      <Typography variant="h4" className={classes.header}>
        {props.label}
      </Typography>
      {props.tournaments.map((tournament) => (
        <TournamentItem tournament={tournament} className={classes.card} key={tournament.id} />
      ))}
    </div>
  )
}
