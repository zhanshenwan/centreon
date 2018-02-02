import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'

const styles = theme => ({
  information: {
    backgroundColor: '#00bfb3'
  },
  warning: {
    backgroundColor: '#ff9a13'
  },
  error: {
    backgroundColor: '#e00b3d'
  }
})

const Notification = ({ notifications, onClose, classes }) => (
  <div>
    {Object.keys(notifications).map((id, index) => {
      if (index === 0) {
        return (
          <Snackbar
            key={'notification-' + id}
            open={true}
            onClose={(event, reason) => {
              if (reason !== 'clickaway') {
                onClose(id)
              }
            }}
            autoHideDuration={notifications[id].timeout}
            anchorOrigin={{
              vertical: notifications[id].position.vertical,
              horizontal: notifications[id].position.horizontal
            }}
            SnackbarContentProps={{
              className: classes[notifications[id].type]
            }}
            message={notifications[id].message}
            action={[,
              <IconButton
                key="close"
                id="closeNotification"
                aria-label="Close"
                color="inherit"
                onClick={() => {onClose(id)}}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        )
      }
    })}
  </div>
)

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Notification)