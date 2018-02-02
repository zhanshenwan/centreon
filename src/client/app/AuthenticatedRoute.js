import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

class AuthenticatedRoute extends Component {
  render () {
    const { component: Component, authLoading, isLogged, ...rest } = this.props

    return (
      <Route {...rest} render={props => {
        if (authLoading) return <div>Loading...</div>
        return isLogged
          ? <Component {...props} />
          : <Redirect to='/' />
      }} />
    )
  }
}

const stateToProps = (store) => ({
  authLoading: store.authReducer.authLoading,
  isLogged: store.authReducer.isLogged,
  token: store.authReducer.token
})

export default withRouter(connect(stateToProps)(AuthenticatedRoute))
