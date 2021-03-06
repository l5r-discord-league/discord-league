import { User, isAdmin } from '../hooks/useUsers'
import React from 'react'
import { Chip } from '@material-ui/core'

export function UserChip(props: { user: { permissions: number } }) {
  return isAdmin(props.user) ? (
    <Chip label="Admin" color="primary" />
  ) : (
    <Chip label="Player" color="secondary" />
  )
}
