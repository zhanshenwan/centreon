import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import LoginForm from './LoginForm'
import { auth } from 'Services/hubApi'

/**
 * Login Form Container
 */
class LoginFormContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLogged: false,
      error: ''
    }
  }

  handleClick = (user) => {
    this.props.authenticate(user)
  }

  render = () => {
    const { isLogged, error } = this.props

    if (isLogged) {
      return (
        <Redirect to="/app/instances" />
      )
    } else {
      return (
        <LoginForm
          onSubmit={this.handleClick}
          user={{ username: '', password: '' }}
          error={error.message}
        />
      )
    }
  }
}

const mapStateToProps = (store) => {
  return {
    isLogged: store.authReducer.isLogged,
    error: store.authReducer.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authenticate: (user) => {
      dispatch(auth(user))
    }
  }
}

/**
 * Login Form Container Prototypes
 */
LoginFormContainer.propTypes = {
  /**
   * Centreon LDAP User credentials
   *
   */
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }),
  /**
   * Error displayed
   *
   */
  error: PropTypes.shape({
    code: PropTypes.number,
    message: PropTypes.string
  }),
  /**
   * Authenticate with credentials
   * @param {Object} user
   */
  onSubmit: PropTypes.func
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginFormContainer));
