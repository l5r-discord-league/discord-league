import { Container } from '@material-ui/core'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'

import { ClanMon } from '../components/ClanMon/ClanMon'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { UserAvatar } from '../components/UserAvatar/UserAvatar'
import { UserRole } from '../components/UserRole'
import { useUsers, RowUser } from '../hooks/useUsers'

export function UserView(): JSX.Element {
  const [users] = useUsers()
  const history = useHistory()
  function navigateToProfile(id: string) {
    history.push('/user/' + id)
  }

  if (users.error) {
    return <RequestError requestError={users.error} />
  }
  if (users.loading) {
    return <Loading />
  }
  if (users.data == null) {
    return <EmptyState />
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
            field: 'role',
            title: 'Role',
            render: (rowData: RowUser) => <UserRole admin={rowData.user.permissions === 1} />,
          },
        ]}
        data={users.data}
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
