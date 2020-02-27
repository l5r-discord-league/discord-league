import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, AppBar, Tabs, Tab, Typography, Toolbar } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

function a11yProps(index: number) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  }
}

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      textAlign: 'left',
      flexGrow: 1,
    },
  })
)

export function NavBar() {
  const classes = useStyles()
  const location = useLocation()
  const history = useHistory()

  function navigate(to: string) {
    history.push(to)
  }

  const tabs = ['/tournaments', '/my-games', '/users']

  function getCurrentTabIndex(path: string): number {
    const index = tabs.findIndex(element => element === path)
    return index < 0 ? 0 : index
  }

  const [tabIndex, setTabIndex] = React.useState(getCurrentTabIndex(location.pathname))

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue)
  }

  function registerUser() {
    window.location.href = '/api/auth'
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense" color="primary.light">
          <Typography variant="h5" className={classes.title}>
            Discord League
          </Typography>
          <Button color="secondary" variant="contained" onClick={() => registerUser()}>
            Login via Discord
          </Button>
        </Toolbar>
        <Tabs variant="fullWidth" value={tabIndex} onChange={handleChange}>
          <Tab
            component="a"
            onClick={() => navigate(tabs[0])}
            label="Tournaments"
            {...a11yProps(0)}
          />
          <Tab component="a" onClick={() => navigate(tabs[1])} label="My Games" {...a11yProps(1)} />
          <Tab component="a" onClick={() => navigate(tabs[2])} label="Users" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
    </div>
  )
}
