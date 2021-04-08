import { FC } from 'react'
import styles from './styles.module.scss'

const avatarSrc = (displayAvatarURL?: string, userId?: string, userAvatar?: string) =>
  displayAvatarURL ?? (userId && userAvatar)
    ? `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.webp`
    : `https://cdn.discordapp.com/embed/avatars/1.png`

export const UserAvatar: FC<{
  userId?: string
  userAvatar?: string
  displayAvatarURL?: string
  userName?: string
  large?: boolean
  small?: boolean
}> = (props) => {
  const src = `${avatarSrc(props.displayAvatarURL, props.userId, props.userAvatar)}?size=${
    props.large ? 128 : props.small ? 32 : 64
  }`

  return (
    <div className={styles.root}>
      <img
        src={src}
        className={`${styles.avatar} ${
          props.large ? styles.avatarLarge : props.small ? styles.avatarSmall : styles.avatarMedium
        }`}
      />
      {props.userName && <p className={styles.username}>{' ' + props.userName}</p>}
    </div>
  )
}
