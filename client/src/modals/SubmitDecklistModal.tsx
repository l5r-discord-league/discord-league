import React, { useCallback, useState } from 'react'
import {
  Button,
  ButtonGroup,
  createStyles,
  makeStyles,
  Modal,
  TextField,
  Theme,
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
      marginTop: theme.spacing(3),
    },
  })
)

export function SubmitDecklistModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: (decklist: { link: string; decklist: string }) => void
}) {
  const classes = useStyles()
  const [link, setLink] = useState('')
  const [decklist, setDecklist] = useState('')
  const confirm = useCallback(() => {
    if (link.length > 0 && decklist.length > 0) {
      onConfirm({ link, decklist })
    }
  }, [onConfirm, link, decklist])

  return (
    <Modal
      aria-labelledby="start-tournament-modal-title"
      open
      onClose={onCancel}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <h2 id="start-tournament-modal-title">Decklist submission</h2>

        <TextField
          required
          fullWidth
          label="Link to the decklist"
          margin="normal"
          onChange={(ev) => setLink(ev.target.value)}
        />
        <TextField
          required
          fullWidth
          multiline
          margin="normal"
          rows={10}
          label="Paste the decklist"
          onChange={(ev) => setDecklist(ev.target.value)}
        />

        <ButtonGroup className={classes.buttonGroup}>
          <Button
            color="inherit"
            variant="contained"
            onClick={onCancel}
            style={{ marginRight: 20 }}
          >
            Cancel
          </Button>

          <Button color="secondary" variant="contained" onClick={confirm}>
            Submit
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  )
}
