import React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export function GameView(): JSX.Element {
  return (
    <div>
      <h4>My Games</h4>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unfinished-games-content"
          id="unfinished-games-header"
        >
          <Typography>Unfinished Games</Typography>
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
          <Typography>Finished Games</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>Finished Games Go Here.</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}
