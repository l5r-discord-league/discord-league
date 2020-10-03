import React from 'react'
import { Container } from '@material-ui/core'

export function RequestError(props: { requestError: string }) {
  return (
    <Container>
      <h5>Error while retrieving tournament: {props.requestError}</h5>
    </Container>
  )
}
