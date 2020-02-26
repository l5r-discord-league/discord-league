import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, AppBar, Tabs, Tab } from '@material-ui/core'

function a11yProps(index: number) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  }
}

function LinkTab(props: { label: string; to: string }) {
  const history = useHistory()

  function navigate(to: string) {
    history.push(to)
  }

  return (
    <Tab component="a" onClick={() => navigate(props.to)} {...props}>
      {props.label}
    </Tab>
  )
}

export function NavBar() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  function registerUser() {
    window.location.href = '/api/auth'
  }

  return (
    <div>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Tournaments" to="/tournaments" {...a11yProps(0)} />
          <LinkTab label="My Games" to="/my-games" {...a11yProps(1)} />
          <LinkTab label="Users" to="/users" {...a11yProps(2)} />
          <Tab
            component={Button}
            variant="contained"
            color="primary"
            label="Register via Discord"
            onClick={() => registerUser()}
          />
        </Tabs>
      </AppBar>
    </div>
  )
}
