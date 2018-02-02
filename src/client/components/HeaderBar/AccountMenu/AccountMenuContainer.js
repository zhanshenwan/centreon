import React, { Component } from 'react'
import { connect } from 'react-redux'
import AccountMenu from './AccountMenu'
import { LogoutItem } from 'Components/HeaderBar/AccountMenu/LogoutItem'

class AccountMenuContainer extends Component {

  constructor (props) {
    super(props)

    this.state = {
      hidden: true,
    }
  }

  onClick = () => {
    this.setState(
      (prevState) => {
        return {hidden: !prevState.hidden}
      }
    )
  }

  render = () => {
    const { username, ...props } = this.props
    const { hidden } = this.state

    return (
      <AccountMenu
        username={username}
        hidden={hidden}
        onClick={this.onClick}
      >
        <LogoutItem {...props}/>
      </AccountMenu>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    username: store.authReducer.username
  }
}

export default connect(mapStateToProps)(AccountMenuContainer)