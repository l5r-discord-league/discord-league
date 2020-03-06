import React from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export function MessageSnackBar(props: {
  open: boolean
  onClose: () => void
  error?: boolean
  warning?: boolean
  message: string
  autoHideDuration?: number
}) {
  return (
    <Snackbar
      open={props.open}
      onClose={props.onClose}
      autoHideDuration={props.autoHideDuration || 6000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Alert severity={props.error ? 'error' : props.warning ? 'warning' : 'success'}>
        {props.message}
      </Alert>
    </Snackbar>
  )
}
