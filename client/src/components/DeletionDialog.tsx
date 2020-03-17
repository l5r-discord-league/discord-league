import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core'
import React from 'react'

export function DeletionDialog(props: {
  entity: string
  dialogOpen: boolean
  onClose: () => void
  handleDeleteAction: () => void
}) {
  return (
    <Dialog
      open={props.dialogOpen}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Do you really want to delete this {props.entity}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" color="error">
          This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={props.handleDeleteAction} color="primary" variant="contained" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
