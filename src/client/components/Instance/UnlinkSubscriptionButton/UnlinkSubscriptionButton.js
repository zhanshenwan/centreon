import React from 'react'
import { withStyles } from 'material-ui/styles'
import { Button } from 'material-ui'
import LinkIcon from 'material-ui-icons/Link'

const styles = {
  unlinkSubscriptionButton: {
    width: '20px',
    height: '20px',
    minWidth: '24px',
    minHeight: '24px',
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
    backgroundColor: '#0072CE',
  },
  unlinkSubscriptionIcon: {
    width: '16px',
    height: '16px',
    fill: '#FFFFFF',
  },
}

const UnlinkSubscriptionButton = ({ classes, instanceId, onClick }) => (
      <Button
        fab aria-label="unlink subscription" className={classes.unlinkSubscriptionButton}
        onClick={onClick}
        id={'unlink-' + instanceId}
      >
        <LinkIcon className={classes.unlinkSubscriptionIcon}/>
      </Button>
    )

export default withStyles(styles)(UnlinkSubscriptionButton)