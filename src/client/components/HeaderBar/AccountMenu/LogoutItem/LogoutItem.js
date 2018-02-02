import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import PowerSettingsNew from 'material-ui-icons/PowerSettingsNew'
import { ListItem, ListItemText } from 'material-ui/List'

const styles = theme => ({
  accountMenuIcons: {
    height: '24px',
    width: '24px',
    fill: '#009fdf'
  },
  itemText: {
    color: '#A7A9AC',
    padding: '8px 8px'
  },
})

class LogoutItem extends Component {

  render = () => {
    const { classes } = this.props

    return (
        <ListItem
          button
          onClick={this.props.onClick}
          disableGutters={true}
        >
          <PowerSettingsNew className={classes.accountMenuIcons}/>
          <ListItemText secondary="Logout" classes={{primary: classes.itemText}} />
        </ListItem>
    )
  }
}

export default withStyles(styles, { withTheme: true })(LogoutItem)