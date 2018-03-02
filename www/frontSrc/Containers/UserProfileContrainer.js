import React, { Component } from 'react'
import UserProfile from '../Components/Header/User/UserProfile'

export default class UserProfileContrainer extends Component {

  state = {
    anchorEl: null,
  };

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null })
  };

  render () {

    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <UserProfile
        handleClose={this.handleClose}
        handleOpen={this.handleOpen}
        open={open}
        anchorEl={anchorEl}
      />
      )
  }
}