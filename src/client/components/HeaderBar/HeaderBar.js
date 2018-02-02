import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Tabs, { Tab } from 'material-ui/Tabs'
import { Link } from "react-router-dom"

const styles = theme => ({
  appBar: {
    position: 'inherit',
    backgroundColor: '#009fdf'
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    marginRight: "40px"
  },
  tabs: {
    flex: 1
  },
  tab: {
    height: '64px'
  }
})

class HeaderBar extends Component {

  render() {
    const { classes, name, entries, value, handleChange, children } = this.props

    return (
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Typography type="title" color="inherit" className={classes.title}>
            {name}
          </Typography>
          {entries && entries.length &&
            <Tabs
              value={value}
              onChange={handleChange}
              className={classes.tabs}
              indicatorColor="primary"
            >
              {entries.map((entry, index) => {
                return (
                  <Tab
                    className={classes.tab}
                    key={"tab" + index}
                    label={entry.name}
                    component={Link}
                    to={entry.path}
                  />
                )
              })}
            </Tabs>
          }
          <div>
            {children}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

HeaderBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(HeaderBar)