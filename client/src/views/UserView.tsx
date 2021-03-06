import { Container } from '@material-ui/core'

import { useUsers, RowUser } from '../hooks/useUsers'
import MaterialTable from 'material-table'
import UserAvatar from '../components/UserAvatar'
import { UserChip } from '../components/UserChip'
import { useHistory } from 'react-router-dom'
import { ClanMon } from '../components/ClanMon'
import { useCallback } from 'react'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { EmptyState } from '../components/EmptyState'

const useNavigateToProfile = (history:any)=>useCallback((id:string)=>{
    history.push(`/user/${id}` )

},[history])

export function UserView(): JSX.Element {
  const history = useHistory()
  const [data, refetch] = useUsers(undefined)
  const navigateToProfile = useNavigateToProfile(history)

  if (data.loading) {
    return <Loading/>
  }
  if (typeof data.error==='string') {
    return <RequestError requestError={data.error}/>
  }
  if (!data.data) {
    return <EmptyState/>
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
            render: (rowData: RowUser) => <UserChip user={rowData.user} />,
          },
        ]}
        data={data.data}
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
