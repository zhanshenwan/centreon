import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReleasedButton from './ReleasedButton'
import { openConfirmDialog, cleanConfirmDialog } from "Redux/confirmDialog/confirmDialogActions"
import { patchPluginPackReleased } from "Services/hubApi"
import { displayNotification } from 'Redux/notification/notificationActions'

class ReleasedButtonContainer extends Component {
  onClick = () => {
    const {
      openConfirmDialog,
      notifEmptyCatalog,
      catalog,
      slug
    } = this.props
    const confirmDialogContent = {
      body: 'Are you sure to release plugin pack ' + slug + ' ?',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
    if (catalog > 0) {
      openConfirmDialog(slug, confirmDialogContent)
    } else {
      notifEmptyCatalog(slug)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { releasePluginPack, token, pluginPackId, version, slug, allowedSlug } = this.props

    if (nextProps.allowAction === true && slug === allowedSlug) {
      releasePluginPack(token, pluginPackId, version)
    }
  }

  render = () => {
    const { pluginPackId, released } = this.props
    return (
      <ReleasedButton
        pluginPackId={pluginPackId}
        released={released}
        onClick={(!released) ? this.onClick : null}
      />
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  return {
    token: store.authReducer.token,
    slug: store.pluginPacksReducer.items[ownProps.pluginPackId].slug,
    released: store.pluginPacksReducer.items[ownProps.pluginPackId].released,
    version: store.pluginPacksReducer.items[ownProps.pluginPackId].version,
    catalog: store.pluginPacksReducer.items[ownProps.pluginPackId].catalog_level,
    allowAction: store.confirmDialogReducer.allowAction,
    allowedSlug: store.confirmDialogReducer.slug,
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    notifEmptyCatalog: (slug) => {
      dispatch(displayNotification({
        type: 'warning',
        message: 'You have to link ' + slug + ' to a catalog first'
      }))
    },
    openConfirmDialog: (slug, content) => {
      dispatch(openConfirmDialog(slug, content))
    },
    releasePluginPack: (token, pluginPackId, version) => {
      dispatch(patchPluginPackReleased(token, pluginPackId, version))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReleasedButtonContainer)