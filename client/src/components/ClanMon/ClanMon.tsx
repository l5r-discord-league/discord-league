import { FC } from 'react'

import { ReactComponent as NeutralMon } from '../../assets/mons/neu_icon.svg'
import { ReactComponent as CrabMon } from '../../assets/mons/crb_icon.svg'
import { ReactComponent as CraneMon } from '../../assets/mons/crn_icon.svg'
import { ReactComponent as DragonMon } from '../../assets/mons/drg_icon.svg'
import { ReactComponent as LionMon } from '../../assets/mons/lio_icon.svg'
import { ReactComponent as PhoenixMon } from '../../assets/mons/phx_icon.svg'
import { ReactComponent as ScorpionMon } from '../../assets/mons/scp_icon.svg'
import { ReactComponent as UnicornMon } from '../../assets/mons/uni_icon.svg'

import styles from './styles.module.scss'

export const ClanMon: FC<{ clanId?: number; small?: boolean; large?: boolean }> = (props) => {
  const className = props.large ? styles.large : props.small ? styles.small : styles.medium

  switch (props.clanId) {
    case 1:
      return <CrabMon className={className} />
    case 2:
      return <CraneMon className={className} />
    case 3:
      return <DragonMon className={className} />
    case 4:
      return <LionMon className={className} />
    case 5:
      return <PhoenixMon className={className} />
    case 6:
      return <ScorpionMon className={className} />
    case 7:
      return <UnicornMon className={className} />
    default:
      return <NeutralMon className={className} />
  }
}
