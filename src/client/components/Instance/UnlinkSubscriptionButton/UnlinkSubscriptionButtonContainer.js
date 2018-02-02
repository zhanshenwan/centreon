import React, { Component } from 'react'
import { connect } from 'react-redux'
import UnlinkSubscriptionButton from './UnlinkSubscriptionButton'
import { openConfirmDialog, cleanConfirmDialog } from "Redux/confirmDialog/confirmDialogActions"
import { patchInstance } from 'Services/hubApi'

class UnlinkSubscriptionButtonContainer extends Component {

  onClick = () => {
    const { openConfirmDialog, slug } = this.props
    const confirmDialog = {
      body: 'Are you sure to unlink subscription ?',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
    openConfirmDialog(slug, confirmDialog)
  }

  componentWillReceiveProps = (nextProps) => {
    const { patchInstance, token, instanceId, slug, allowedSlug } = this.props

    if (nextProps.allowAction === true && slug === allowedSlug) {
      patchInstance(token, instanceId, {'subscription_id': null})
    }
  }

  render () {
    const { instanceId } = this.props

    return (
      <UnlinkSubscriptionButton
        instanceId={instanceId}
        onClick={this.onClick}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {
    token: store.authReducer.token,
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

export default connect(mapStateToProps, mapDispatchToProps)(UnlinkSubscriptionButtonContainer)