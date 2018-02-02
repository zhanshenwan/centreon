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
import { withStyles } from 'material-ui/styles'
import { TableRow, TableCell } from 'material-ui'
import { HeaderBar } from 'Components/HeaderBar'
import { CatalogFormPopin } from 'Components/PluginPacks/CatalogFormPopin'
import { CatalogSelector } from 'Components/PluginPacks/CatalogSelector'
import { ReleasedButton } from 'Components/PluginPacks/ReleasedButton'
import { FilterCell } from 'Components/PluginPacks/FilterCell'

const styles = theme => ({
  root: {
    padding: '0 15px',
    overflow: 'auto'
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
  textField: {
    '&:hover': {
      background:'transparent'
    },
  }
})

class PluginPacksList extends Component {

  tableRowTemplate = ({children, row}) => {
    return (
      <TableRow id={row.slug}>
        {children}
      </TableRow>
    )
  }

  render = () => {
    const { columns, rows, itemsPerPage, totalItems, currentPage, classes } = this.props

    return (
      <section>
        <div id="pluginPackList" className={classes.root}>
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
              cellComponent={({ column, row, value }) => {
                if (column.name === 'released') {
                  return (
                    <TableCell>
                      <ReleasedButton
                        pluginPackId={row.id}
                      />
                    </TableCell>
                  )
                } else if (column.name === 'catalog_level') {
                  return (
                    <TableCell>
                      <CatalogSelector
                        id={row.id}
                        level={value}
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
            <PagingPanel id={"pagingPanel"}/>
            <TableFilterRow
              messages={{ filterPlaceholder: 'Filter' }}
              cellComponent={FilterCell}
            />
          </Grid>
        </div>
        <CatalogFormPopin />
      </section>
    )
  }
}

/**
 * Instance list Prototypes
 */
PluginPacksList.propTypes = {
  /**
   * Instance list css classes
   * @param {Object} classes
   */
  classes: PropTypes.object.isRequired,
}

PluginPacksList.defaultProps = {
  currentPage: 1
}

export default withStyles(styles)(PluginPacksList)
