import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';

const styles = {

}

class CatalogFormPopin extends Component {
  render = () => {
    const { level, handleChange, handleCancel, handleConfirm, ...other } = this.props

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        {...other}
      >
        <DialogTitle>Choose catalog access</DialogTitle>
        <DialogContent>
          <RadioGroup
            aria-label="level"
            name="level"
            value={level}
            onChange={handleChange}
          >
            <FormControlLabel value={'1'} key={1} control={<Radio />} label={'1 : Free'} />
            <FormControlLabel value={'2'} key={2} control={<Radio />} label={'2 : Registered'} />
            <FormControlLabel value={'3'} key={3} control={<Radio />} label={'3 : Subscribed'} />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button id="cancelCatalogFormPopin" onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button id="confirmCatalogFormPopin" onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(CatalogFormPopin)