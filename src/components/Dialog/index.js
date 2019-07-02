import React from 'react'
import { Dialog as AlertBird, Button } from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { connectWith } from '../../store/fedux'

const Dialog = props => {
  return (
    <>
      <AlertBird
        open={props.dialog.error && true}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{props.dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {props.dialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              props.fedux.dispatch([{ type: 'HANDLE_ERROR', payload: false }])
            }
            color='primary'
            autoFocus
          >
            {props.dialog.button}
          </Button>
        </DialogActions>
      </AlertBird>
    </>
  )
}

export default connectWith()(Dialog, 'dialog')()
