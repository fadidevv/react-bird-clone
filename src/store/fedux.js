/**
* @Author @FadiDev gray at Thailand, Bangkok
*/
/* eslint-disable */
import React from 'react'
var { EventEmitter } = require('eventemitter3'),
  feduxListener = new EventEmitter()

var _holdOn
var globalStore = {}
var _propers = {}

const _ParentConnector = (dispatchToProps, setFeduxToGlobal) => (
  Component,
  _propName,
  _feduxName,
  _state = {},
  _initialState = {}
) => {
  window.toComponents = _initialState
  if (Component.toString().match('componentWillUpdate')) {
    class Fedux extends React.Component {
      static displayName = _feduxName || this.name
      componentDidMount() {
        if (setFeduxToGlobal) setToGlobal()
        if (Object.keys(dispatchToProps).length > 0) {
          window.GLOBAL_FEDUX_ACTION_PROPS = dispatchToProps
          window.globalFeduxContext = this
        }
      }
      render() {
        return (
          <>
            <Component
              {...{
                [_propName]: _objectMerge(_propers, {
                  ...window.toComponents,
                  ...this.props
                })
              }}
              fedux={_ifGlobalFedux()}
              {...dispatchToProps}
              {...{ ['emit']: _emit }}
            />
          </>
        )
      }
    }
    return Fedux
  }
}

const _ParentEnchancer = (Component, _enchancerName, _reducers) => {
  return class Enchancer extends Component {
    static displayName = _enchancerName || this.name
    componentDidMount() {
      window.globalParentContext = this
      window.globalParentName = Component.name
      _globalFedux(_reducers)
    }
    componentWillUpdate = (nextProps, nextState) => {
      window.toComponents = nextState
      _objectMerge(globalStore, nextState)
      window.Store = { ...globalStore }
    }
    render = () => super.render()
  }
}

const _globalFedux = _reducers => {
  if (_reducers !== null) return (window.GLOBAL_FEDUX_REDUCERS = _reducers)
}

const _emit = (name = {}) => {
  let globalActionsFromProps = window.GLOBAL_FEDUX_ACTION_PROPS
  if (typeof globalActionsFromProps === 'object') {
    let ifTruthy = Object.keys(name).some(
      isTruthful => name[isTruthful] === true
    )
    if (ifTruthy) {
      if (name instanceof Object && Object.keys(name).length === 1) {
        for (var actions in name) {
          if (globalActionsFromProps[actions]) {
            return _dispatch(globalActionsFromProps[actions]())
          }
        }
      } else if (name instanceof Object && Object.keys(name).length === 2) {
        for (var actions in name) {
          if (globalActionsFromProps[actions]) {
            return _dispatch(
              globalActionsFromProps[actions](
                ...name[Object.entries(name)[1][0]]
              )
            )
          }
        }
      } else {
        throw new Error(`
            '${JSON.stringify(name)}' is not a object type or it contains 
              more then 1 or 2 objects or objects are empty 
        `)
      }
    } else {
      throw new Error(`
        Did you set the action ${JSON.stringify(name)} object 
        value to 'true' like this ${JSON.stringify(name).replace(
          'false',
          'true'
        )}? 
    `)
    }
  } else {
    throw new Error(`
        Did you passed your actions or actionCreators to the parent 
        class '${window.globalParentName}' component as a props?
    `)
  }
}

const dispose = () =>
  window.globalParentContext !== null || undefined
    ? window.globalParentContext
    : ''

const _dispatch = (action = {}) => {
  if (action !== null) {
    var response = window.GLOBAL_FEDUX_REDUCERS(action)
    window.globalParentContext.setState({ ...response }, () => {
      window.globalFeduxContext.forceUpdate()
    })
  }
}

const dispatcher = actions => {
  if (Array.isArray(actions)) {
    actions.map(dispose => {
      if (typeof dispose === 'object') {
        _dispatch(dispose)
      } else {
        _dispatch(dispose())
      }
    })
  } else {
    return typeof actions === 'object'
      ? _dispatch(actions)
      : _dispatch(actions())
  }
}

const _ifGlobalFedux = _reducersRef => {
  return {
    ['getState']: getState,
    ['subscribe']: subscribe,
    ['dispatch']: dispatcher
  }
}

const setToGlobal = () => (window.Fedux = _ifGlobalFedux())

const _feduxListenerHandler = (
  hookDefault = '__hookFeduxStore',
  _propers = {}
) =>
  feduxListener.on(hookDefault, state => _objectMerge(_propers, { ...state }))

const connectWith = (
  reducers = null,
  dispatchToProps = {},
  setFeduxToGlobal = false
) => (Component, propName = 'data', feduxName, enchancerName) => (
  initialState = {}
) => {
  if (
    (Component.toString().match('return Object') &&
      Component.toString().match('apply')) ||
    Component.toString().match('class')
  ) {
    return _ParentConnector(dispatchToProps, setFeduxToGlobal)(
      _ParentEnchancer(Component, enchancerName, reducers),
      propName,
      feduxName,
      getState,
      initialState
    )
  }
  if (
    Component.toString().match('createElement') &&
    Component.toString().match('Fragment')
  ) {
    return _ParentChildScope()(Component, enchancerName, propName, getState)
  }
}

const _ParentChildScope = () => (
  Component,
  _enchancerName,
  _propName,
  _state = {}
) => {
  const Enchancer = props => {
    Enchancer.displayName = _enchancerName || Enchancer.name
    _objectMerge(_propers, { ..._state() })
    return (
      <>
        <Component
          {...{
            [_propName]: _objectMerge(_propers, {
              ...window.toComponents,
              ...props
            })
          }}
          fedux={_ifGlobalFedux()}
          {...{ ['emit']: _emit }}
        />
      </>
    )
  }
  return Enchancer
}

const _store = () => {
  subscribe()
  return !!window.Store || !!global.Store !== undefined || null
    ? window.Store || global.Store
    : ''
}

const getState = () =>
  _store() !== undefined || null ? _store() || clearTimeout(_holdOn) : ''

const _hookFedux = _reference => (
  (window.hookFedux = _reference), (global.hookFedux = _reference)
)

const _updateOccurred = _state =>
  (_holdOn = setTimeout(
    () => (
      window.hookFedux.setState({ ..._state }),
      global.hookFedux.setState({ ..._state })
    ),
    null
  ))

const subscribe = listener =>
  typeof listener === 'function' ? listener() : null

const _objectMerge = (_propers, _state) =>
  Object.assign(_propers, { ..._state })

export {
  connectWith as createStore,
  connectWith,
  getState,
  subscribe,
  dispatcher
}
