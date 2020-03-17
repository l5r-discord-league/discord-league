import { Select, MenuItem, InputLabel } from '@material-ui/core'
import React from 'react'
import { clans } from '../utils/clanUtils'
import { ClanMon } from './ClanMon'

export function ClanSelect(props: {
  preferredClanId: number
  neutralAllowed?: boolean
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (event: any) => void
}) {
  return (
    <div>
      <InputLabel id="clan">{props.label}</InputLabel>
      <Select id="clan" value={props.preferredClanId} onChange={props.onChange}>
        {props.neutralAllowed && (
          <MenuItem value={undefined}>
            <ClanMon small clanId={0} /> None
          </MenuItem>
        )}
        {clans.map(clan => (
          <MenuItem value={clan.index} key={clan.index}>
            <ClanMon small clanId={clan.index} /> {clan.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
