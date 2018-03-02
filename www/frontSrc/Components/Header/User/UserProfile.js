import React from 'react'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import Grid from 'material-ui/Grid'

const styles = theme => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  avatar: {
    width: 34,
    height: 34,
    display: 'inline-flex',
    verticalAlign: 'middle',
    margin: '6px',
  },
})

const UserProfile = ({classes, open, handleOpen, handleClose, anchorEl}) => (
  <Grid item sm={3}>
    <IconButton
      aria-haspopup="true"
      onClick={handleOpen}
      >
        <Avatar className={classes.avatar}>
          RI
        </Avatar>
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>Add to your bookmark</MenuItem>
      <MenuItem onClick={handleClose}>Désactivate notification sonore</MenuItem>
    </Menu>
  </Grid>
    )

export default withStyles(styles)(UserProfile)
