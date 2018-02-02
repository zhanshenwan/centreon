import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import LoginPage from 'Pages/LoginPage'
import BasicPage from 'Pages/BasicPage'
import AuthenticatedRoute from 'App/AuthenticatedRoute'
import { history } from 'Redux/AppStore'

export default class AppRouter extends Component {
  render () {
    return (
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path='/' component={LoginPage} />
          <AuthenticatedRoute path='/app' component={BasicPage} />
          <Redirect to='/' />
        </Switch>
      </ConnectedRouter>
    )
  }
}
