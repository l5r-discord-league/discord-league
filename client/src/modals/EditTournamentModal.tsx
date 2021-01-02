import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import React, { useReducer } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import {
  Modal,
  Grid,
  TextField,
  ButtonGroup,
  Button,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core'

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

interface State {
  name: string
  startDate: Date
  description?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'CANCEL':
      return {
        name: '',
        description: '',
        startDate: new Date(),
      }
    case 'NEW_NAME':
      return { ...state, name: action.payload }
    case 'NEW_DESCRIPTION':
      return { ...state, description: action.payload }
    case 'NEW_DATE': {
      return { ...state, startDate: action.payload || new Date() }
    }
    default:
      throw new Error()
  }
}

export function EditTournamentModal(props: {
  modalOpen: boolean
  onClose: () => void
  onSubmit: (name: string, startDate: Date, description?: string) => void
  title: string
  initialState?: State
}) {
  const classes = useStyles()
  const initialState = props.initialState || {
    name: '',
    description: '',
    startDate: new Date(),
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Modal
        aria-labelledby="edit-tournament-modal-title"
        aria-describedby="edit-tournament-modal-description"
        open={props.modalOpen}
        onClose={props.onClose}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <h2 id="edit-tournament-modal-title">{props.title}</h2>
          <br />
          <Grid container direction="column" alignItems="stretch">
            <Grid item>
              <TextField
                required
                label="Tournament Name"
                id="tournament-name"
                variant="outlined"
                className={classes.inputField}
                value={state.name}
                onChange={(event) =>
                  dispatch({ type: 'NEW_NAME', payload: event.currentTarget.value })
                }
              />
            </Grid>
            <Grid item>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="tournament-start-date"
                label="Tournament Start Date"
                value={state.startDate}
                onChange={(date: Date | null) => dispatch({ type: 'NEW_DATE', payload: date })}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Tournament Description"
                id="tournament-name"
                variant="outlined"
                value={state.description}
                rows={3}
                multiline
                className={classes.inputField}
                onChange={(event) =>
                  dispatch({ type: 'NEW_DESCRIPTION', payload: event.currentTarget.value })
                }
              />
            </Grid>
          </Grid>
          <br />
          <br />
          <ButtonGroup className={classes.buttonGroup}>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => {
                dispatch({ type: 'CANCEL' })
                props.onClose()
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => props.onSubmit(state.name, state.startDate, state.description)}
            >
              {props.title}
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </MuiPickersUtilsProvider>
  )
}
