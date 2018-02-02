import React, { Component } from 'react'
import { connect } from 'react-redux'
import { HeaderBar } from 'Components/HeaderBar'
import PluginPacks from './PluginPacks'
import { getPluginPacksStatistics, getPluginPackStatistics } from 'Services/hubApi'

export class PluginPacksContainer extends Component {

  constructor (props) {
    super(props)

    this.state = {
      searchValue: '',
      options: {
        tooltips: {
          mode: 'index'
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              minRotation: 0,
              maxRotation: 45,
              autoSkip: true,
              maxTicksLimit: 11
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero:true
            }
          }]
        }
      },
      data: {
        labels: [],
        datasets: [
          {
            label: 'Installation',
            backgroundColor: 'rgba(142,204,0,0.2)',
            borderColor: 'rgba(39,101,26,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(142,204,0,0.4)',
            hoverBorderColor: 'rgba(39,101,26,1)',
            data: [],
          },
          {
            label: 'Update',
            backgroundColor: 'rgba(82,172,230,0.2)',
            borderColor: 'rgba(16,6,159,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(82,172,230,0.4)',
            hoverBorderColor: 'rgba(16,6,159,1)',
            data: [],
          },
        ]
      }
    }
  }

  componentDidMount = () => {
    this.getPluginPacksStatistics()
  }

  componentWillMount = () => {
    this.timer = null
  }

  getPluginPacksStatistics = () => {
    const { token, getPluginPacksStatistics } = this.props
    const { searchValue } = this.state
    getPluginPacksStatistics(token, searchValue)
  }

  getPluginPackStatistics = (slug) => {
    const { token, getPluginPackStatistics} = this.props
    getPluginPackStatistics(token, slug)
  }

  formatPluginPacksStatistics = () => {
    const { pluginPacksStatistics } = this.props
    const { data } = this.state

    let labels = []
    let installation = []
    let update = []

    for (const slug of Object.keys(pluginPacksStatistics)) {
      labels.push(slug)
      installation.push(pluginPacksStatistics[slug].totalInstalled)
      update.push(pluginPacksStatistics[slug].totalUpdated)
    }

    data.title = 'All plugin packs'
    data.labels = labels
    data.datasets[0].data = installation
    data.datasets[1].data = update

    return data
  }

  formatPluginPackStatistics = () => {
    const { slug, pluginPacksStatistics } = this.props
    const { data } = this.state

    let labels = []
    let installation = []
    let update = []

    for (const version of Object.keys(pluginPacksStatistics[slug].versions)) {
      labels.push(version)
      installation.push(pluginPacksStatistics[slug].versions[version].totalInstalled)
      update.push(pluginPacksStatistics[slug].versions[version].totalUpdated)
    }

    data.title = slug
    data.labels = labels
    data.datasets[0].data = installation
    data.datasets[1].data = update

    return data
  }

  handleSearch = (event) => {
    const value = event.target.value

    this.setState({ searchValue: value })

    clearTimeout(this.timer)

    this.timer = setTimeout(
      () => {
        this.getPluginPacksStatistics()
      },
      500
    )
  }

  handleClick = (element) => {
    const { loading, slug } = this.props

    // Avoid to fetch multiple times on click spam
    if (!loading) {
      if (!element[0] || slug) { // Fetch all plugin packs statistics if click outside data or if a single plugin pack is already displayed
        this.getPluginPacksStatistics()
      } else { // Fetch single plugin pack statistics
        this.getPluginPackStatistics(element[0]._model.label)
      }
    }
  }

  render = () => {
    const { loading, slug } = this.props
    const { options, searchValue } = this.state

    let formattedData
    if (!slug) {
      formattedData = this.formatPluginPacksStatistics()
    } else {
      formattedData = this.formatPluginPackStatistics()
    }

    return (
      <PluginPacks
        slug={slug}
        searchValue={searchValue}
        handleSearch={this.handleSearch}
        handleClick={this.handleClick}
        loading={loading}
        options={options}
        data={formattedData}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {
    token: store.authReducer.token,
    loading: store.statisticsReducer.loading,
    slug: store.statisticsReducer.slug,
    pluginPacksStatistics: store.statisticsReducer.pluginPacks,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    getPluginPacksStatistics: (token, search) => {
      return dispatch(getPluginPacksStatistics(token, search))
    },
    getPluginPackStatistics: (token, slug) => {
      return dispatch(getPluginPackStatistics(token, slug))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PluginPacksContainer)