import React from 'react'
import { Input } from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Battery90Sharp, LockSharp } from '@material-ui/icons'

import '../Ride/index.css'
import { connectWith } from '../../store/fedux'

const Ride = props => {
  return (
    <>
      {props.ride.code && (
        <Card id='scooterDetails'>
          <CardContent>
            <p>
              CODE: <strong id='codeColor'>{props.ride.code}</strong>
            </p>
            <p>
              Battery Level: <Battery90Sharp id='batteryColor' />
            </p>
            <p>
              Locked: <LockSharp id='lockColor' />
            </p>
          </CardContent>
        </Card>
      )}
      <Input
        type='text'
        id='inputStartStopRide'
        placeholder={props.ride.inputStartStopText}
        value={props.ride.inputStartStopRideValue}
        onChange={({ target }) =>
          props.emit({
            handleStartStopRide: true,
            inputStartStopRideValue: [target]
          })
        }
        style={{ marginTop: props.ride.code ? 100 : 300 }}
        required
        autoFocus={true}
      />
      <Fab
        id='buttonStartStopRide'
        color='primary'
        onClick={() =>
          props.emit({
            handleRideConfirmations: true,
            payload: [
              props.ride.inputStartStopRideValue,
              props.ride.lat,
              props.ride.lang,
              props.ride.token
            ]
          })
        }
      >
        {props.ride.buttonStartStopText}
      </Fab>
    </>
  )
}

export default connectWith()(Ride, 'ride')()
