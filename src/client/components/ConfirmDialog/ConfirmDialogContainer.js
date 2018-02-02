import React, { Component } from 'react'
import { connect } from 'react-redux'
import ConfirmDialog from "./ConfirmDialog"
import {
  resetAction,
  confirmAction
} from 'Redux/confirmDialog/confirmDialogActions'

class ConfirmDialogContainer extends Component {

  handleCancel = () => {
    const { resetAction } = this.props
    resetAction()
  }

  handleConfirm = () => {
    const { confirmAction, slug } = this.props
    confirmAction(slug)
  }

  render () {
    const { open, content } = this.props

    return (
      <ConfirmDialog
        open={open}
        content={content}
        onCancel={this.handleCancel}
        onConfirm={this.handleConfirm}
      />
    )
  }
}

const mapStateToProps = (store) => {
  return {
    slug: store.confirmDialogReducer.slug,
    open: store.confirmDialogReducer.open,
    content: store.confirmDialogReducer.content,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetAction: () => {
      return dispatch(resetAction())
    },
    confirmAction: (slug) => {
      return dispatch(confirmAction(slug))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDialogContainer)