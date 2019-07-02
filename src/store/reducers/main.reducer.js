import {
  HANDLE_INPUT_RIDE,
  SAVE_TOKEN,
  HANDLE_START_STOP_RIDE,
  CONTROL_RIDE_BUTTON_TEXT,
  CONTROL_RIDE_INPUT_TEXT,
  HANDLE_PRELOADER,
  HANDLE_CODE,
  HANDLE_RIDE_BUTTON_TEXT,
  HANDLE_ERROR
} from '../constants'
import state from '../state/initialState'

const mainReducer = actions => {
  switch (actions.type) {
    case HANDLE_INPUT_RIDE:
      return {
        inputRideValue: actions.payload
      }
    case SAVE_TOKEN:
      return {
        token: actions.payload
      }
    case CONTROL_RIDE_BUTTON_TEXT:
      return {
        textRide: actions.payload
      }
    case CONTROL_RIDE_INPUT_TEXT:
      return {
        textInputRide: actions.payload
      }
    case HANDLE_START_STOP_RIDE:
      return {
        inputStartStopRideValue: actions.payload
      }
    case HANDLE_PRELOADER:
      return {
        preloader: actions.payload
      }
    case HANDLE_CODE:
      return {
        code: actions.payload
      }
    case HANDLE_RIDE_BUTTON_TEXT:
      return {
        buttonStartStopText: actions.payload
      }
    case HANDLE_ERROR:
      return {
        error: actions.payload
      }
    default:
      return state
  }
}

export default mainReducer
