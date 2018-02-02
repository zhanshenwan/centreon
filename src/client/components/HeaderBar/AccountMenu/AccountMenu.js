import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import AccountCircle from 'material-ui-icons/AccountCircle'
import Card, { CardContent } from 'material-ui/Card'
import List from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography';

const styles = theme => ({
  headerIcons: {
    height: '34px',
    width: '34px',
  },
  accountMenu: {
    zIndex: 2,
    position: 'absolute',
    top: '55px',
    right: '25px',
  },
  accountList: {
    padding: '0 0'
  },
  accountContent: {
    '&:last-child': {
      paddingBottom: '10px',
    },
  },
})

class AccountMenu extends Component {

  render = () => {
    const { children, classes, username, hidden, onClick } = this.props

    return (
      <section>
        <IconButton
          id="accountMenuButton"
          color="inherit"
          onClick={onClick}
        >
          <AccountCircle className={classes.headerIcons} />
        </IconButton>
        {!hidden &&
          <Card id="accountMenuContent" className={classes.accountMenu}>
            <CardContent classes={{root: classes.accountContent}}>
              <Typography gutterBottom noWrap align="left">
                {username}
              </Typography>
              <Divider/>
              <List dense={true} className={classes.accountList}>
                {children}
              </List>
            </CardContent>
          </Card>
        }
      </section>
    )
  }
}

AccountMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AccountMenu)