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

import { dispatcher } from '../fedux'
import axios from 'axios'

export const handleInputRide = inputRideValue => {
  const { value: currentValue } = inputRideValue
  return {
    type: HANDLE_INPUT_RIDE,
    payload: currentValue
  }
}

export const handleStartStopRide = inputStartStopRideValue => {
  const { value: currentValue } = inputStartStopRideValue
  return {
    type: HANDLE_START_STOP_RIDE,
    payload: currentValue
  }
}

export const handleConfirmation = inputRideValue => {
  if (
    inputRideValue === '' ||
    inputRideValue === null ||
    !inputRideValue.match('@')
  ) {
    return {
      type: HANDLE_ERROR,
      payload: 'Please enter your email'
    }
  } else {
    (async () => await makeBirdLoginRequest(inputRideValue))()
    return {
      type: HANDLE_ERROR,
      payload: false
    }
  }
}

export const handleRideConfirmations = (
  inputStartStopRideValue,
  lat,
  lang,
  token
) => {
  if (inputStartStopRideValue === '' || inputStartStopRideValue === null) {
    return {
      type: HANDLE_ERROR,
      payload: 'Please enter any scooterId'
    }
  } else {
    (async () =>
      await getBirdScooterById(inputStartStopRideValue, lat, lang, token))()
    return {
      type: HANDLE_ERROR,
      payload: false
    }
  }
}

export const saveToken = token => {
  return {
    type: SAVE_TOKEN,
    payload: token
  }
}

export const controlRideButtonText = () => {
  return {
    type: CONTROL_RIDE_BUTTON_TEXT,
    payload: 'ENTER CODE'
  }
}

export const controlRideInputText = () => {
  return {
    type: CONTROL_RIDE_INPUT_TEXT,
    payload: 'ENTER YOUR CODE'
  }
}

const _birdRequestConfig = (_token = null) => {
  const token = _token !== null ? { Authorization: `Bird ${_token}` } : ''
  const request = axios.create({
    baseURL: 'https://api.birdapp.com',
    headers: {
      'Device-id': '06b8b764-22dd-4fe1-b897-c78af5231ca1',
      Platform: 'android',
      'App-Version': '4.35.1.1',
      ...token
    }
  })
  return request
}

const makeBirdLoginRequest = async email => {
  try {
    dispatcher([{ type: HANDLE_PRELOADER, payload: true }])
    let response = await _birdRequestConfig().request({
      method: 'POST',
      url: '/user/login',
      data: {
        email: email
      },
      responseType: 'json'
    })
    if (response.status === 200 && !response.data.token) {
      dispatcher([
        { type: HANDLE_INPUT_RIDE, payload: '' },
        controlRideButtonText,
        controlRideInputText,
        { type: HANDLE_PRELOADER, payload: false }
      ])
      return response.data
    } else {
      dispatcher([
        { type: HANDLE_INPUT_RIDE, payload: '' },
        {
          type: HANDLE_ERROR,
          payload:
            'Sorry, only already registered users are allowed from Bird App'
        },
        { type: HANDLE_PRELOADER, payload: false }
      ])
    }
  } catch (error) {
    if (error.response) {
      dispatcher([
        { type: HANDLE_ERROR, payload: error.response.data.errors },
        { type: HANDLE_INPUT_RIDE, payload: '' },
        { type: HANDLE_PRELOADER, payload: false }
      ])
    }
  }
}

export const verifyBirdLoginRequest = async code => {
  try {
    dispatcher([{ type: HANDLE_PRELOADER, payload: true }])
    let response = await _birdRequestConfig().request({
      method: 'PUT',
      url: '/request/accept',
      data: {
        token: code
      },
      responseType: 'json'
    })
    if (response.status === 200 && response.data.token) {
      dispatcher([
        { type: SAVE_TOKEN, payload: response.data.token },
        { type: HANDLE_PRELOADER, payload: false }
      ])
    }
  } catch (error) {
    if (error.response) {
      dispatcher([
        { type: HANDLE_ERROR, payload: error.response.data.message },
        { type: HANDLE_PRELOADER, payload: false }
      ])
    }
  }
}

export const getBirdScooterById = async (
  scooterId,
  lat = '47.3817767',
  lang = '8.5043783',
  token
) => {
  try {
    dispatcher([
      { type: HANDLE_CODE, payload: '' },
      { type: HANDLE_PRELOADER, payload: true }
    ])
    let response = await _birdRequestConfig(token).request({
      method: 'PUT',
      url: `/bird/chirp`,
      data: {
        alarm: false,
        bird_id: scooterId
      },
      headers: {
        Location: JSON.stringify({ latitude: lat, longitude: lang })
      },
      responseType: 'json'
    })
    if (response.status === 200) {
      dispatcher([
        { type: HANDLE_START_STOP_RIDE, payload: '' },
        { type: HANDLE_RIDE_BUTTON_TEXT, payload: 'START' },
        { type: HANDLE_CODE, payload: response.data.code },
        { type: HANDLE_PRELOADER, payload: false }
      ])
    }
  } catch (error) {
    if (error.response) {
      dispatcher([
        { type: HANDLE_ERROR, payload: error.response.data.message },
        { type: HANDLE_PRELOADER, payload: false }
      ])
    }
  }
}
