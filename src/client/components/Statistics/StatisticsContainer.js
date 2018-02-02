import React, { Component } from 'react'
import { connect } from 'react-redux'
import Statistics from './Statistics'
import { PluginPacks } from 'Components/Statistics/PluginPacks'
import { Instances } from 'Components/Statistics/Instances'
import { cleanHeader, replaceTitle, replaceEntries } from 'Redux/header/headerActions'


class StatisticsContainer extends Component {

  constructor (props) {
    super(props)

    const { match } = props

    this.state = {
      entries: [
        {
          name: 'Plugin Packs',
          path: `${match.path}/pluginpacks`,
          component: PluginPacks
        },
        {
          name: 'Instances',
          path: `${match.path}/instances`,
          component: Instances
        },
      ]
    }
  }

  componentDidMount = () => {
    const { cleanHeader, replaceHeaderTitle, replaceHeaderEntries } = this.props
    const { entries } = this.state

    cleanHeader()
    replaceHeaderTitle('Statistics')
    replaceHeaderEntries(entries)
  }

  render = () => {
    const { entries } = this.state

    return (
      <Statistics
        entries={entries}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cleanHeader: () => {
      return dispatch(cleanHeader())
    },
    replaceHeaderTitle: (title) => {
      return dispatch(replaceTitle(title))
    },
    replaceHeaderEntries: (entries) => {
      return dispatch(replaceEntries(entries))
    },
  }
}

export default connect(null, mapDispatchToProps)(StatisticsContainer)