import React, { Component } from 'react'
import { store } from 'Redux/AppStore'
import LogoutItem from './LogoutItem'
import {
  displayNotification
} from 'Redux/notification/notificationActions'
import {
  logoutSuccess
} from 'Redux/auth/authActions'
import {connect} from "react-redux";

class LogoutItemContainer extends Component {
  render = () => {
    return (
      <LogoutItem
        onClick={this.props.logout}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(displayNotification({message: 'Logout success', timeout: 2000}))
      return dispatch(logoutSuccess('logout'))
    },
  }
}

export default connect(null, mapDispatchToProps)(LogoutItemContainer)