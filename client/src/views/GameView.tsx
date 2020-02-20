import React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {},
}))

export function GameView(): JSX.Element {
  const classes = useStyles()

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unfinished-games-content"
          id="unfinished-games-header"
        >
          <Typography className={classes.heading}>Unfinished Games</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>Unfinished Games Go Here.</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="finished-games-content"
          id="finished-games-header"
        >
          <Typography className={classes.heading}>Finished Games</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>Finished Games Go Here.</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}
