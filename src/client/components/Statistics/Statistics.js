import React from 'react'
import { withStyles } from 'material-ui/styles'
import { HeaderBar } from 'Components/HeaderBar'
import { Route, Switch, Redirect } from 'react-router-dom'

const styles = theme => ({
  title: {
    align: 'center'
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1,
  }
})

const Statistics = ({ entries }) => (
  <section>
    <Switch>
      {entries.map((entry, index) => {
        return (
          <Route
            key={'stats' + index}
            path={entry.path}
            exact
            component={entry.component}
          />
        )
      })}
      <Redirect to={entries[0].path} />
    </Switch>
  </section>
)

export default withStyles(styles)(Statistics)