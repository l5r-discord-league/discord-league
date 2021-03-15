import { RankedParticipant } from '@dl/api'
import { Grid, Typography } from '@material-ui/core'
import { memo } from 'react'
import ReactMinimalPieChart from 'react-minimal-pie-chart'

import { clans } from '../utils/clanUtils'
import { timezones } from '../utils/timezoneUtils'

export const PlayersPieChart = memo((props: { participants: RankedParticipant[] }) => {
  const pieChartData = clans.map((clan) => ({
    color: clan.color,
    title: clan.name,
    value: props.participants.filter((participant) => participant.clanId === clan.clanId).length,
  }))
  const timezoneData = timezones.map((timezone) => ({
    title: timezone.timezone,
    value: props.participants.filter((participant) => participant.timezoneId === timezone.id)
      .length,
  }))

  return (
    <Grid container>
      <Grid item xs={12} md={6}>
        <ReactMinimalPieChart
          data={pieChartData.sort((a, b) => b.value - a.value)}
          paddingAngle={0}
          radius={42}
          style={{
            height: '300px',
          }}
          viewBoxSize={[300, 300]}
          label
          labelPosition={112}
          labelStyle={{
            fontFamily: 'sans-serif',
            fontSize: '24px',
          }}
          startAngle={270}
          lengthAngle={360}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">
          Total number of participants: {props.participants.length}
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography>By Clan:</Typography>
            {pieChartData.map((data) => (
              <Typography key={data.color}>
                {data.title}: <b>{data.value}</b>
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>By Timezone:</Typography>
            {timezoneData.map((data) => (
              <Typography key={data.title}>
                {data.title}: <b>{data.value}</b>
              </Typography>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
})
