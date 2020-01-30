import { User } from './user'
import { Role } from './role'

export function getCurrentUser(): User {
  // TODO Authenticate
  return new User(
    {
      id: 'idontcarethisisplaceholderanyway',
      username: 'WorkerBee',
      avatar: 'thelastairbender',
      discriminator: 'idk',
      locale: 'de-DE',
      // eslint-disable-next-line @typescript-eslint/camelcase
      mfa_enabled: false,
      flags: 0,
    },
    Role.Admin
  )
}
