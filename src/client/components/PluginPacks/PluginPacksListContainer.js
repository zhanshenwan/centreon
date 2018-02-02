import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PluginPacksList from './PluginPacksList'
import { getPluginPacks } from 'Services/hubApi'
import { cleanHeader, replaceTitle} from 'Redux/header/headerActions'

class PluginPacksListContainer extends Component {

  constructor (props) {
    super(props)

    this.state = {
      columns: [
        {name: 'slug', title: 'Slug'},
        {name: 'name', title: 'Name'},
        {name: 'version', title: 'Version'},
        {name: 'catalog_level', title: 'Catalog'},
        {name: 'released', title: 'Released'},
      ],
      currentPage: 0,
      itemsPerPage: 10,
      filters: []
    }
  }

  componentDidMount = () => {
    const { cleanHeader, replaceHeaderTitle } = this.props
    cleanHeader()
    replaceHeaderTitle('Plugin Packs')

    this.getData()
  }

  changeFilters = (filters) => {
    this.setState(
      {
        filters: filters,
        currentPage: 0
      },
      this.getData
    )
  }

  changeCurrentPage = (currentPage) => {
    this.setState(
      {currentPage: currentPage},
      this.getData
    )
  }

  /**
   * example : page[number]=1&page[size]=30
   * @returns {string|*}
   */
  getPagination = () => {
    const { currentPage, itemsPerPage } = this.state
    return `?page[number]=${currentPage + 1}&page[size]=${itemsPerPage}`
  }

  /**
   * example : filter[instanceName]=centreon&filter[fingerprint]=abc
   * @returns {string|*}
   */
  getFilters = () => {
    const { filters } = this.state;

    return filters.reduce((acc, { columnName, value }) => {
      if (columnName == 'catalog_level' && value == '0') {
        acc.push(`filter[with_catalog]=false`)
      } else {
        acc.push(`filter[${columnName}]=${value}`)
      }
      return acc
    }, []).join('&')
  }

  getData = () => {
    const { token, displayPluginPacks } = this.props
    displayPluginPacks(this.getPagination(), this.getFilters(), token)
  }

  render = () => {
    const { columns, currentPage } = this.state
    const { items, itemsPerPage, totalPages, totalItems, ...props } = this.props

    const rows = items ?
      Object.keys(items).reduce((acc, key) => {
        acc[items[key].order] = items[key]
        return acc
      }, [])
      : []

    return (
      <PluginPacksList
        columns={columns}
        rows={rows}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        totalItems={totalItems}
        currentPage={currentPage}
        changeFilters={this.changeFilters}
        changeCurrentPage={this.changeCurrentPage}
        {...props}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {
    token: store.authReducer.token,
    items: store.pluginPacksReducer.items,
    totalPages: store.pluginPacksReducer.totalPages,
    totalItems: store.pluginPacksReducer.totalItems,
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
    displayPluginPacks: (pagination, filters, token) => {
      return dispatch(getPluginPacks(pagination, filters, token))
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PluginPacksListContainer))