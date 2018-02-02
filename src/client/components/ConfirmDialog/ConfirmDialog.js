import React, { Component } from 'react'
import Dialog, { DialogActions, DialogContent } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

const ConfirmDialog = ({open, content, onCancel, onConfirm}) => (
  <Dialog
    disableBackdropClick
    disableEscapeKeyDown
    maxWidth="xs"
    open={open}
  >
    <DialogContent>
      <Typography gutterBottom align="center">
        {content.body}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary" id="cancelBtn">
        {content.cancel}
      </Button>
      <Button onClick={onConfirm} color="primary" id="confirmBtn">
        {content.confirm}
      </Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmDialog