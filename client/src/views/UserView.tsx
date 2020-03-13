import React from 'react'
import { Typography, Container } from '@material-ui/core'

import { useUsers, User } from '../hooks/useUsers'
import MaterialTable from 'material-table'
import UserAvatar from '../components/UserAvatar'
import { getClanForId } from '../utils/clanUtils'
import { UserChip } from '../components/UserChip'
import { useHistory } from 'react-router-dom'

interface RowUser {
  user: User
  discordName: string
  jigokuName: string
  preferredClan: string
  userId: string
}

export function UserView(): JSX.Element {
  const users: RowUser[] = useUsers().flatMap((user: User) => {
    return {
      user: user,
      discordName: user.discordName + '#' + user.discordDiscriminator,
      jigokuName: user.jigokuName || 'Not specified',
      preferredClan: user.preferredClanId ? getClanForId(user.preferredClanId) : 'Not specified',
      userId: user.discordId,
    } as RowUser
  })
  const history = useHistory()

  function navigateToProfile(id: string) {
    history.push('/user/' + id)
  }

  return (
    <Container>
      <MaterialTable
        columns={[
          {
            field: 'user',
            title: 'Avatar',
            searchable: false,
            sorting: false,
            render: (rowData: RowUser) => <UserAvatar user={rowData.user} />,
          },
          {
            field: 'discordName',
            title: 'Discord Name',
          },
          {
            field: 'jigokuName',
            title: 'Jigoku Name',
          },
          {
            field: 'preferredClan',
            title: 'Prefered Clan',
          },
          {
            field: 'user',
            title: 'Role',
            searchable: false,
            sorting: false,
            render: (rowData: RowUser) => <UserChip user={rowData.user} />,
          },
        ]}
        data={users}
        title="Users"
        options={{
          search: true,
          paging: false,
          sorting: true,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: 'person',
            tooltip: 'Go to Profile',
            onClick: (event, rowData) => {
              if (rowData instanceof Array) {
                navigateToProfile(rowData[0].userId)
              } else {
                navigateToProfile((rowData as RowUser).userId)
              }
            },
          },
        ]}
      />
    </Container>
  )
}
