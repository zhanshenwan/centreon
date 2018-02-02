import React, { Component } from 'react'
import { connect } from 'react-redux'
import ComputerIcon from 'material-ui-icons/Computer'
import FilterNoneIcon from 'material-ui-icons/FilterNone'
import TrendingUpIcon from 'material-ui-icons/TrendingUp'
import Navigator from './Navigator'

class NavigatorContainer extends Component {

  constructor (props) {
    super(props)

    this.state = {
      open: false,
      entries: [
        {
          id: 'instancesNavigator',
          name: 'Instances',
          path: '/app/instances',
          icon: (
            <ComputerIcon style={{
              fill: '#A7A9AC',
              width: '26px',
              height: '26px',
            }} />
          ),
        },
        {
          id: 'pluginPacksNavigator',
          name: 'Plugin Packs',
          path: '/app/pluginpacks',
          icon: (
            <FilterNoneIcon style={{
              fill: '#A7A9AC',
              width: '26px',
              height: '26px',
            }} />
          ),
        },
        {
          id: 'statisticsNavigator',
          name: 'Statistics',
          path: '/app/statistics',
          icon: (
            <TrendingUpIcon style={{
              fill: '#A7A9AC',
              width: '26px',
              height: '26px',
            }} />
          ),
        },
      ]
    }
  }

  handleDrawer = () => {
    this.setState(
      (prevState) => { return { open: !prevState.open } }
    )
  }

  render = () => {
    const { notifications } = this.props
    const notificationCounter = Object.keys(notifications).length

    return (
      <Navigator
        open={this.state.open}
        entries={this.state.entries}
        handleDrawer={this.handleDrawer}
        notificationCounter={notificationCounter}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {
    notifications: store.notificationReducer.notifications,
  }
}

export default connect(mapStateToProps)(NavigatorContainer)