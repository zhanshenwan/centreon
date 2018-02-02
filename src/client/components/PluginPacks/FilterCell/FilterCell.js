import React from 'react'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui'
import { TableCell } from 'material-ui'

const FilterCell = (props) => {
  const { column, filter, onFilter } = props
  if (column.name === 'catalog_level') {
    return(
      <TableCell id="filterCatalog">
        <TextField
          select
          value={filter ? filter.value : ''}
          onChange={e => onFilter(e.target.value ? {value: e.target.value} : null)}
          SelectProps={{
            native: false,
          }}
          margin="normal"
        >
          <MenuItem key="catalogAll" id="filterCatalogAll" value="">All</MenuItem>
          <MenuItem key="catalog0" id="filterCatalog0" value="0">Unlinked</MenuItem>
          <MenuItem key="catalog1" id="filterCatalog1" value="1">1 : Free</MenuItem>
          <MenuItem key="catalog2" id="filterCatalog2" value="2">2 : Registered</MenuItem>
          <MenuItem key="catalog3" id="filterCatalog3" value="3">3 : Subscribed</MenuItem>
        </TextField>
      </TableCell>
    )
  } else if (column.name === 'released') {
    return (
      <TableCell id="filterReleased">
        <TextField
          select
          value={filter ? filter.value : ''}
          onChange={e => onFilter(e.target.value ? {value: e.target.value} : null)}
          SelectProps={{
            native: false,
          }}
          margin="normal"
        >
          <MenuItem key="all" id="filterReleasedAll" value="">All</MenuItem>
          <MenuItem key="released" id="filterReleasedReleased" value="true">Released</MenuItem>
          <MenuItem key="notReleased" id="filterReleasedNotReleased" value="false">Not Released</MenuItem>
        </TextField>
      </TableCell>
    )
  } else if (column.name === 'version') {
    return <TableCell></TableCell>
  }
  return (
    <TableFilterRow.Cell
      id={"filter" + column.name.charAt(0).toUpperCase() + column.name.slice(1)}
      {...props}
    />
  )
}

export default FilterCell