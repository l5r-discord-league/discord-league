import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { AppBar, Tabs, Tab, Typography, Toolbar } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import UserMenu from './UserMenu'

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

  const tabs = ['/tournaments', '/my-matches', '/users']

  function getCurrentTabIndex(path: string): number {
    const index = tabs.findIndex(
      element => element.substr(0, 5) === path.substr(0, Math.min(path.length, 5))
    )
    return index < 0 ? 0 : index
  }

  const [tabIndex, setTabIndex] = React.useState(getCurrentTabIndex(location.pathname))

  const handleChange = (event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense" color="primary.light">
          <Typography variant="h5" className={classes.title}>
            Discord League
          </Typography>
          <UserMenu />
        </Toolbar>
        <Tabs variant="fullWidth" value={tabIndex} onChange={handleChange}>
          <Tab
            component="a"
            onClick={() => navigate(tabs[0])}
            label="Tournaments"
            {...a11yProps(0)}
          />
          <Tab
            component="a"
            onClick={() => navigate(tabs[1])}
            label="My Matches"
            {...a11yProps(1)}
          />
          <Tab component="a" onClick={() => navigate(tabs[2])} label="Users" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
    </div>
  )
}
