import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from './store/fedux'
import mainReducer from './store/reducers/main.reducer'
import initialState from './store/state/initialState'
import {
  handleInputRide,
  handleStartStopRide,
  handleConfirmation,
  verifyBirdLoginRequest,
  handleRideConfirmations
} from './store/actions/main.actions'
import Main from './components/Main'
import * as serviceWorker from './serviceWorker'

const FeduxProvider = createStore(
  mainReducer,
  {
    handleInputRide,
    handleStartStopRide,
    handleConfirmation,
    verifyBirdLoginRequest,
    handleRideConfirmations
  },
  false
)(Main)(initialState)

ReactDOM.render(<FeduxProvider />, document.getElementById('root'))
serviceWorker.unregister()

if (module.hot) module.hot.accept()
