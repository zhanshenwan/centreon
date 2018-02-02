import React, { Component } from 'react'
import { connect } from 'react-redux'
import Notification from './Notification'
import { closeNotification } from 'Redux/notification/notificationActions'

class NotificationContainer extends Component {
  render = () => {
    const { notifications, handleClose } = this.props

    return (
      <Notification
        notifications={notifications}
        onClose={handleClose}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {
    notifications: store.notificationReducer.notifications,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    handleClose: (id) => {
      return dispatch(closeNotification(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer)