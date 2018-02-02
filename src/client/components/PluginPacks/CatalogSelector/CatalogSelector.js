import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar';
import deepPurple from 'material-ui/colors/deepPurple'
import Error from 'material-ui-icons/Error'

const styles = {
  root: {
    display: "inline-block"
  },
  avatar: {
    width: 22,
    height: 22,
    fontSize: 14,
    cursor: "pointer"
  },
  purpleAvatar: {
    width: 22,
    height: 22,
    fontSize: 14,
    cursor: "pointer",
    backgroundColor: deepPurple[400],
  },
  errorIcon: {
    fill: '#d1d2d4',
    cursor: "pointer"
  },
}

class CatalogSelector extends Component {

  render = () => {
    const { classes, handleClick, level } = this.props

    if (level !== null) {
      return (
        <Avatar
          onClick={handleClick}
          className={classes.purpleAvatar}
        >
          {level}
        </Avatar>
      )
    } else {
      return (
        <div className={classes.root}>
          <Error
            onClick={handleClick}
            className={classes.errorIcon}
          />
        </div>
      )
    }
  }
}

export default withStyles(styles)(CatalogSelector)