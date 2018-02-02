import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'
import { HeaderBar } from 'Components/HeaderBar'
import { Navigator } from 'Components/Navigator'
import { InstanceList } from 'Components/Instance'
import { PluginPacksList } from 'Components/PluginPacks'
import { Statistics } from 'Components/Statistics'
import { ConfirmDialog } from 'Components/ConfirmDialog'
import { Notification } from 'Components/Notification'

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    overflow: 'hidden'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF'
  },
  mainContent: {
    flex: 1,
  }
})

const BasicPage = ({ match, classes }) => {
  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <Navigator />
        <div className={classes.mainContent}>
          <HeaderBar/>
          <Switch>
            <Route path={`${match.path}/instances`} exact component={InstanceList} />
            <Route path={`${match.path}/pluginpacks`} component={PluginPacksList} />
            <Route path={`${match.path}/statistics`} component={Statistics} />
            <Redirect to={`${match.url}`} />
          </Switch>
          <ConfirmDialog />
          <Notification />
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(BasicPage)
