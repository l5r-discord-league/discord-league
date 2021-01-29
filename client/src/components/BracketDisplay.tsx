import React from 'react'
import { Typography } from '@material-ui/core'

function bracketName(bracketType: 'silverCup' | 'goldCup') {
  switch (bracketType) {
    case 'silverCup':
      return 'Silver Cup Bracket'
    case 'goldCup':
      return 'Gold Cup Bracket'
  }
}

function bracketColor(bracketType: 'silverCup' | 'goldCup') {
  switch (bracketType) {
    case 'silverCup':
      return '#c0c0c0'
    case 'goldCup':
      return '#ffd700'
  }
}

export function BracketDisplay({
  bracket,
}: {
  bracket: { url: string; bracket: 'silverCup' | 'goldCup' }
}) {
  return (
    <>
      <div style={{ backgroundColor: bracketColor(bracket.bracket) }}>
        <Typography variant="h4" align="center">
          {bracketName(bracket.bracket)}
        </Typography>
      </div>
      <iframe
        src={`${bracket.url}/module`}
        width="100%"
        height="650"
        frameBorder="0"
        scrolling="auto"
        allowTransparency
      ></iframe>
    </>
  )
}
