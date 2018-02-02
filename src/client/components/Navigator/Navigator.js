import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import Drawer from 'material-ui/Drawer'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import MoreHoriz from 'material-ui-icons/MoreHoriz'
import Announcement from 'material-ui-icons/Announcement'
import Badge from 'material-ui/Badge'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#231f20',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  moreHoriz: {
    fill: '#009FDF',
    height: '28px',
    width: '28px',
  },
  navIcon: {
    fill: 'A7A9AC'
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    backgroundColor: '#231f20',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerInner: {
    flex: '1 1 auto',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  itemText: {
    color: '#A7A9AC'
  },
  listTop: {
    flex: '1 1 auto',
  },
  listBot: {
    flex: '0 0 auto',
    width: 60,
    bottom: 0
  },
  notifDiv: {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    minHeight: '28px',
  },
  notifEntry: {
    fill: 'white',
    height: '20px',
    width: '20px',
    display: 'block',
    margin: 'auto',
    transform: 'translateY(20%)'
  },
  notifBubble: {
    width: '20px',
    height: '20px',
    color: 'white',
    backgroundColor: '#00A499'
  },
})

const Navigator = ({ open, entries, handleDrawer, notificationCounter, classes }) => (
  <div className={classes.root}>
    <Drawer
      type="permanent"
      className={classes.listTop}
      classes={{
        paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.drawerInner}>
        <List>
          <ListItem id='openMenu' button onClick={handleDrawer}>
            <ListItemIcon>
              <MoreHoriz className={classes.moreHoriz} />
            </ListItemIcon>
            <ListItemText primary='Centreon' classes={{primary: classes.itemText}} />
          </ListItem>
          {entries.map((entry, index) => {
            return (
              <ListItem
                key={"nav" + index}
                id={entry.id}
                button
                component={Link}
                to={entry.path}
              >
                <ListItemIcon>
                  {entry.icon}
                </ListItemIcon>
                <ListItemText secondary={entry.name} classes={{secondary: classes.itemText}} />
              </ListItem>
            )
          })}
        </List>
        <Divider />
      </div>
    </Drawer>
    <List className={classes.listBot}>
      <ListItem id='notificationCounter' button>
        <ListItemIcon>
          <Badge
            badgeContent={notificationCounter}
            classes={{badge: classes.notifBubble}}
          >
            <div className={classes.notifDiv}>
              <Announcement className={classes.notifEntry}/>
            </div>
          </Badge>
        </ListItemIcon>
      </ListItem>
    </List>
  </div>
)

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Navigator)