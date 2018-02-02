import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderBar from './HeaderBar'
import { AccountMenu } from 'Components/HeaderBar/AccountMenu'
import { withRouter } from 'react-router'

export class HeaderBarContainer extends Component {

  constructor (props) {
    super(props)

    const { location, entries } = props
    const path = location.pathname

    let value = 0
    if (entries && entries.length) {
      entries.map((entry, index) => {
        if (path == entry.path) {
          value = index
        }
      })
    }

    this.state = {
      value: value
    }
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { title, entries } = this.props
    const { value } = this.state

    return (
      <HeaderBar
        name={title}
        entries={entries}
        value={value}
        handleChange={this.handleChange}
      >
        <AccountMenu/>
      </HeaderBar>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    title: store.headerReducer.title,
    entries: store.headerReducer.entries
  }
}

export default withRouter(connect(mapStateToProps)(HeaderBarContainer))