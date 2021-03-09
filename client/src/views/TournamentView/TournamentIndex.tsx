import { Tournament } from '@dl/api'
import { Container, Paper, Tab, Tabs, Theme, createStyles, makeStyles } from '@material-ui/core'
import { memo, useState } from 'react'

import { TournamentList } from '../../components/TournamentList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      marginBottom: theme.spacing(2),
    },
  })
)

export const TournamentIndex = memo(
  (props: {
    ongoingTournaments: Tournament[]
    pastTournaments: Tournament[]
    upcomingTournaments: Tournament[]
  }) => {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState<'current' | 'archive'>('current')

    return (
      <Container>
        <Paper className={classes.tabs}>
          <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)}>
            <Tab label="Current" value="current" />
            <Tab label="Archive" value="archive" />
          </Tabs>
        </Paper>

        {activeTab === 'current' && (
          <>
            {props.upcomingTournaments.length > 0 && (
              <TournamentList label="Upcoming" tournaments={props.upcomingTournaments} />
            )}
            {props.ongoingTournaments.length > 0 && (
              <TournamentList label="Current" tournaments={props.ongoingTournaments} />
            )}
          </>
        )}
        {activeTab === 'archive' && props.pastTournaments.length > 0 && (
          <TournamentList label="Archive" tournaments={props.pastTournaments} />
        )}
      </Container>
    )
  }
)
