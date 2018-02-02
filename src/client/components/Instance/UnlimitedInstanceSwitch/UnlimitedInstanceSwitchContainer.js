import React, { Component } from 'react'
import { connect } from 'react-redux'
import UnlimitedInstanceSwitch from './UnlimitedInstanceSwitch'
import { openConfirmDialog, cleanConfirmDialog } from "Redux/confirmDialog/confirmDialogActions"
import { patchInstance } from 'Services/hubApi'

class UnlimitedInstanceSwitchContainer extends Component {

  onSwitch = (event, checked) => {
    const { openConfirmDialog, slug, serverName } = this.props
    const confirmDialog = {
      body: (checked ? 'Grant' : 'Revoke') + ' unlimited access to "' + serverName + '" ?',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
    openConfirmDialog(slug, confirmDialog)
  }

  componentWillReceiveProps = (nextProps) => {
    const { patchInstance, token, instanceId, checked, slug, allowedSlug } = this.props

    if (nextProps.allowAction === true && slug === allowedSlug) {
      let viewNotReleased = checked ? 0 : 1
      patchInstance(token, instanceId, {'view_not_released': viewNotReleased})
    }
  }

  render = () => {
    const { checked, instanceId } = this.props

    return (
      <UnlimitedInstanceSwitch
        instanceId={instanceId}
        checked={checked}
        onChange={this.onSwitch}
      />
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  return {
    token: store.authReducer.token,
    serverName: store.instanceReducer.items[ownProps.instanceId].serverName,
    checked: store.instanceReducer.items[ownProps.instanceId].unlimitedAccess.unlimitedMode,
    allowAction: store.confirmDialogReducer.allowAction,
    allowedSlug: store.confirmDialogReducer.slug,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openConfirmDialog: (slug, content) => {
      dispatch(openConfirmDialog(slug, content))
    },
    patchInstance: (token, instanceId, attributes) => {
      dispatch(patchInstance(token, instanceId, attributes))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnlimitedInstanceSwitchContainer)