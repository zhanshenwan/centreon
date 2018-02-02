import React, { Component } from 'react'
import InstanceList from './InstanceList'
import { connect } from 'react-redux'
import { getInstances } from 'Services/hubApi'
import { cleanHeader, replaceTitle} from 'Redux/header/headerActions'

export class InstanceListContainer extends Component {

  constructor (props) {
    super(props)

    this.state = {
      columns: [
        {name: 'companyName', title: 'Company name'},
        {name: 'fingerprint', title: 'Fingerprint'},
        {name: 'serverName', title: 'Server name'},
        {name: 'subscriptionState', title: 'Subscription state'},
        {name: 'unlimitedAccess', title: 'Unlimited access'},
      ],
      currentPage: 0,
      itemsPerPage: 12,
      filters: []
    }
  }

  componentDidMount = () => {
    const { cleanHeader, replaceHeaderTitle } = this.props
    cleanHeader()
    replaceHeaderTitle('Instances')

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
      acc.push(`filter[${columnName}]=${value}`);
      return acc;
    }, []).join('&');
  }

  getData = () => {
    const { token } = this.props
    this.props.displayInstances(this.getPagination(), this.getFilters(), token)
  }

  render = () => {
    const { columns, currentPage } = this.state
    const { items, itemsPerPage, totalPages, totalItems } = this.props

    const rows = items ?
      Object.keys(items).reduce((acc, key) => {
        acc.push(items[key])
        return acc
      }, [])
      : []

    return (
      <InstanceList
        columns={columns}
        rows={rows}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        totalItems={totalItems}
        currentPage={currentPage}
        changeFilters={this.changeFilters}
        changeCurrentPage={this.changeCurrentPage}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {
    token: store.authReducer.token,
    items: store.instanceReducer.items,
    totalPages: store.instanceReducer.totalPages,
    totalItems: store.instanceReducer.totalItems,
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
    displayInstances: (pagination, filters, token) => {
      return dispatch(getInstances(pagination, filters, token))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstanceListContainer)