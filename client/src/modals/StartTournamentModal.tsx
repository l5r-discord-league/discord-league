import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import React, { useState } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { Modal, ButtonGroup, Button, makeStyles, Theme, createStyles } from '@material-ui/core'

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
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    inputField: {
      width: 350,
    },
  })
)

export function StartTournamentModal(props: {
  modalOpen: boolean
  onClose: () => void
  onSubmit: (deadline: Date) => void
}) {
  const classes = useStyles()
  const [deadline, setDeadline] = useState(new Date())

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Modal
        aria-labelledby="start-tournament-modal-title"
        aria-describedby="start-tournament-modal-description"
        open={props.modalOpen}
        onClose={props.onClose}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <h2 id="start-tournament-modal-title">Start tournament?</h2>
          <br />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="group-stage-deadline"
            label="Group Stage Deadline"
            value={deadline}
            onChange={(date: Date | null) => date !== null && setDeadline(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <br />
          <br />
          <ButtonGroup className={classes.buttonGroup}>
            <Button color="inherit" variant="contained" onClick={() => props.onClose()}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" onClick={() => props.onSubmit(deadline)}>
              Start Tournament!
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </MuiPickersUtilsProvider>
  )
}
