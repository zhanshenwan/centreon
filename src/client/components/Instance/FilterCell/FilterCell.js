import React from 'react'
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui'
import { TableCell } from 'material-ui'

const FilterCell = (props) => {
  const { column } = props

  if (! (column.name === 'companyName' || column.name === 'fingerprint')) {
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