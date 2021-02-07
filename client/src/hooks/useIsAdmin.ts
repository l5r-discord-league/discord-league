import { useContext } from 'react'
import { UserContext } from '../App'

export function useIsAdmin() {
  const user = useContext(UserContext)
  return user?.permissions === 1
}
