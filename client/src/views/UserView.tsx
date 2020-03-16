import React from 'react'
import { Container } from '@material-ui/core'

import { useUsers, RowUser } from '../hooks/useUsers'
import MaterialTable from 'material-table'
import UserAvatar from '../components/UserAvatar'
import { UserChip } from '../components/UserChip'
import { useHistory } from 'react-router-dom'
import { ClanMon } from '../utils/ClanMon'

export function UserView(): JSX.Element {
  const users: RowUser[] = useUsers()
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
            render: (rowData: RowUser) => (
              <UserAvatar userId={rowData.userId} userAvatar={rowData.user.discordAvatar} />
            ),
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
            title: 'Preferred Clan',
            render: (rowData: RowUser) => (
              <div>
                <ClanMon clanId={rowData.user.preferredClanId} small /> {rowData.preferredClan}
              </div>
            ),
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
        }}
        actions={[
          {
            icon: 'person',
            tooltip: 'Go to Profile',
            onClick: (event, rowData) => {
              // rowData is always Type OR Type[] in material table
              if (Array.isArray(rowData)) {
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
