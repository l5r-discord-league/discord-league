import { Chip } from '@material-ui/core'

export function UserRole(props: { admin: boolean }) {
  if (props.admin) {
    return <Chip label="Admin" color="primary" />
  }
  return <Chip label="Player" color="secondary" />
}
