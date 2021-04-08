import { FC } from 'react'
import styles from './styles.module.scss'

export const BracketDisplay: FC<{ bracket: { url: string; bracket: 'silverCup' | 'goldCup' } }> = (
  props
) => (
  <>
    <div className={props.bracket.bracket === 'silverCup' ? styles.silver : styles.gold}>
      <h4 className={styles.header}>
        {props.bracket.bracket === 'silverCup' ? 'Silver Cup Bracket' : 'Gold Cup Bracket'}
      </h4>
    </div>
    <iframe
      src={`${props.bracket.url}/module`}
      width="100%"
      height="650"
      frameBorder="0"
      scrolling="auto"
      allowTransparency
    ></iframe>
  </>
)
