import { Select, MenuItem, InputLabel } from '@material-ui/core'
import { clans } from '../utils/clanUtils'
import { ClanMon } from './ClanMon'

export function ClanSelect(props: {
  preferredClanId?: number
  neutralAllowed?: boolean
  label: string
  onChange: (clanId?: number) => void
}) {
  return (
    <div>
      <InputLabel id="clan">{props.label}</InputLabel>
      <Select
        id="clan"
        value={props.preferredClanId}
        onChange={({ target: { value } }) =>
          props.onChange(typeof value === 'number' ? value : undefined)
        }
      >
        {props.neutralAllowed && (
          <MenuItem value={undefined}>
            <ClanMon small clanId={0} /> None
          </MenuItem>
        )}
        {clans.map((clan) => (
          <MenuItem value={clan.clanId} key={clan.clanId}>
            <ClanMon small clanId={clan.clanId} /> {clan.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
