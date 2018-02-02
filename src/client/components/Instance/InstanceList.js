import React, { Component } from 'react'
import {
  PagingState,
  FilteringState,
  CustomPaging
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  PagingPanel
} from '@devexpress/dx-react-grid-material-ui'
import PropTypes from 'prop-types'
import CheckCircle from 'material-ui-icons/CheckCircle'
import { withStyles } from 'material-ui/styles'
import { TableRow, TableCell } from 'material-ui'
import { UnlimitedInstanceSwitch } from 'Components/Instance/UnlimitedInstanceSwitch'
import { UnlinkSubscriptionButton } from 'Components/Instance/UnlinkSubscriptionButton'
import { FilterCell } from 'Components/Instance/FilterCell'

const styles = theme => ({
  root: {
    padding: '0 15px',
    overflow: 'auto'
  },
  HeaderRows: {
    position: 'sticky',
    zIndex: '1',
    top: '0'
  },
  TableCell: {
    wordWrap: 'break-word',
    padding: '4px 14px',
  },
  check: {
    fill: '#88B917'
  },
  checkInactive: {
    fill: '#d1d2d4'
  },
  dialog: {
    width: '80%',
    maxHeight: 435,
  },
})

class InstanceList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      filters: [],
    }
  }

  tableRowTemplate = ({children, row}) => {
    return (
      <TableRow id={row.companyName.replace(' ', '-')}>
        {children}
      </TableRow>
    )
  }

  render = () => {
    const { columns, classes, rows, itemsPerPage, totalItems, currentPage } = this.props

    return (
      <div id="instanceList" className={classes.root}>
        <Grid
          columns={columns}
          rows={rows}
        >
          <FilteringState
            onFiltersChange={this.props.changeFilters}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.props.changeCurrentPage}
            pageSize={itemsPerPage}
          />
          <CustomPaging
            totalCount={totalItems}
          />
          <Table
            rowComponent={this.tableRowTemplate}
            cellComponent={({ column, value }) => {
              if (column.name === 'subscriptionState') {
                if (value.state) {
                  return (
                    <TableCell>
                      <UnlinkSubscriptionButton
                        instanceId={value.instanceId}
                        slug={value.slug}
                      />
                    </TableCell>
                  )
                } else {
                  return (
                    <TableCell>
                      <CheckCircle className={classes.checkInactive} />
                    </TableCell>
                  )
                }
              }
              if (column.name === 'unlimitedAccess') {
                return (
                  <TableCell className={classes.TableCell}>
                    <UnlimitedInstanceSwitch
                      instanceId={value.instanceId}
                      slug={value.slug}
                    />
                  </TableCell>
                )
              }
              return (
                <TableCell className={classes.TableCell}>{value}</TableCell>
              )
            }}
          />
          <TableHeaderRow />
          <PagingPanel />
          <TableFilterRow
            cellComponent={FilterCell}
          />
        </Grid>
      </div>
    )
  }
}

/**
 * Instance list Prototypes
 */
InstanceList.propTypes = {
  /**
   * Instance list css classes
   * @param {Object} classes
   */
  classes: PropTypes.object.isRequired,
}

InstanceList.defaultProps = {
  currentPage: 0
}

export default withStyles(styles)(InstanceList)