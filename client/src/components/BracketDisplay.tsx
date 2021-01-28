import React from 'react'

function bracketName(bracketType: 'silverCup' | 'goldCup') {
  switch (bracketType) {
    case 'silverCup':
      return 'Silver Cup Bracket'
    case 'goldCup':
      return 'Gold Cup Bracket'
  }
}

export function BracketDisplay({
  bracket,
}: {
  bracket: { url: string; bracket: 'silverCup' | 'goldCup' }
}) {
  return (
    <>
      <h1>{bracketName(bracket.bracket)}</h1>
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
