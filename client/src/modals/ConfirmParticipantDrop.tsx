import DateFnsUtils from '@date-io/date-fns'
import { ParticipantWithUserData } from '@dl/api'
import { Modal, ButtonGroup, Button, makeStyles, Theme, createStyles } from '@material-ui/core'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { useContext } from 'react'

import { UserContext } from '../App'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    buttonGroup: {
      marginTop: theme.spacing(2),
    },
    inputField: {
      width: 350,
    },
  })
)

function textForModal(participant: ParticipantWithUserData, currentUserDiscordId?: string) {
  if (participant.userId === currentUserDiscordId) {
    return {
      title: 'Do you want to drop from the tournament?',
      cancel: `Wait, what? No, I don't wanna drop!`,
      confirm: `Yes, I don't want to play in this tournament anymore.`,
    }
  }

  return {
    title: `Drop ${participant.discordTag} from the tournament?`,
    cancel: `Oops! No, don't drop them!`,
    confirm: `Yes, and I double checked that it's the right player`,
  }
}

export function ConfirmParticipantDrop(props: {
  participant: ParticipantWithUserData
  onCancel: () => void
  onConfirm: () => void
}) {
  const classes = useStyles()
  const currentUser = useContext(UserContext)
  const text = textForModal(props.participant, currentUser?.discordId)

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Modal
        aria-labelledby="start-tournament-modal-title"
        aria-describedby="start-tournament-modal-description"
        open
        onClose={props.onCancel}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <h2 id="start-tournament-modal-title">{text.title}</h2>
          <ButtonGroup className={classes.buttonGroup}>
            <Button
              color="inherit"
              variant="contained"
              onClick={props.onCancel}
              style={{ marginRight: 20 }}
            >
              {text.cancel}
            </Button>

            <Button color="secondary" variant="contained" onClick={props.onConfirm}>
              {text.confirm}
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </MuiPickersUtilsProvider>
  )
}
