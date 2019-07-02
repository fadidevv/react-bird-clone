import React, { Component } from 'react'
import { Grid, Button, Input } from '@material-ui/core'

import '../Main/index.css'
import logo from '../../assets/logo.png'
import preloader from '../../assets/preloader.svg'
import Dialog from '../Dialog/index'
import Ride from '../Ride/index'

class Main extends Component {
  render() {
    return (
      <Grid container item direction='column' alignItems='center'>
        <img id='birdLogo' src={logo} alt=''/>
        {this.props.data.token ? (
          <Ride lat='47.3817767' lang='8.5043783' />
        ) : (
          <>
            {this.props.data.preloader && (
              <img id='birdPreloader' src={preloader} alt=''/>
            )}
            <Input
              type='text'
              id='inputRide'
              placeholder={this.props.data.textInputRide}
              value={this.props.data.inputRideValue}
              onChange={({ target }) =>
                this.props.emit({
                  handleInputRide: true,
                  inputRideValue: [target]
                })
              }
              required
              autoFocus={true}
            />
            <Button
              id='buttonRide'
              variant='contained'
              onClick={() =>
                this.props.emit(
                  this.props.data.textRide === 'RIDE'
                    ? {
                        handleConfirmation: true,
                        inputRideValue: [this.props.data.inputRideValue]
                      }
                    : {
                        verifyBirdLoginRequest: true,
                        code: [this.props.data.inputRideValue]
                      }
                )
              }
            >
              {this.props.data.textRide}
            </Button>
          </>
        )}
        {this.props.data.error && (
          <Dialog
            title='Error while requesting'
            content={this.props.data.error}
            button='OK'
          />
        )}
      </Grid>
    )
  }
}

export default Main
