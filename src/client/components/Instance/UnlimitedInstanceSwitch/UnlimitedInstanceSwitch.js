import React from 'react'
import { withStyles } from 'material-ui/styles'
import { Switch } from 'material-ui'
import AllInclusive from 'material-ui-icons/AllInclusive'

const styles = {
  bar: {},
  checked: {
    '& + $bar': {
      backgroundColor: '#88b917',
    },
  },
  limitedIcon: {
    width: '14px',
    height: '14px',
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
    borderRadius: '50%',
    backgroundColor: '#e7e7e8',
    padding: '4px',
    fill: '#818285',
  },
  unlimitedIcon: {
    width: '14px',
    height: '14px',
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
    borderRadius: '50%',
    backgroundColor: '#88b917',
    padding: '4px',
    fill: '#FFFFFF',
  },
}

const UnlimitedInstanceSwitch = ({ classes, checked, onChange, instanceId }) => (
      <Switch
        classes={
          {
            checked: classes.checked,
            bar: classes.bar,
          }
        }
        id={'switch-' + instanceId}
        icon={<AllInclusive className={classes.limitedIcon} />}
        checked={checked}
        checkedIcon={<AllInclusive  className={classes.unlimitedIcon}/>}
        onChange={onChange}
      />
    )

export default withStyles(styles)(UnlimitedInstanceSwitch)