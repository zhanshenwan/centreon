import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import CheckCircle from 'material-ui-icons/CheckCircle'

const styles = {
  check: {
    fill: '#88B917',
  },
  checkInactive: {
    fill: '#d1d2d4',
    cursor: 'pointer',
  },
}

const ReleasedButton = ({ classes, pluginPackId, released, onClick }) => (
  <span
    id={"released" + pluginPackId}
    data-released={released}
    onClick={onClick}
  >
    <CheckCircle className={released ? classes.check : classes.checkInactive}/>
  </span>
)

export default withStyles(styles)(ReleasedButton)