import { useState, useEffect } from 'react'
import { hawkStore } from './react-hawk-store'
import { IHawkOpts, IHawkState, IHawkEyeOpts, IHawkEyeState, Setter } from './react-hawk-types'

export * from './react-hawk-store'
export * from './react-hawk-types'

const store = hawkStore()
export function hawk<V>(opts: IHawkOpts<V>): IHawkState<V> {
  store.dispatch(opts, opts.default)
  return {
    ...opts
  }
}

export function hawkeye<V>(opts: IHawkEyeOpts<V>): IHawkEyeState<V> {
  const subscriptions: { [key: string]: (v: IHawkEyeState<V>) => any } = {}
  function dispatch() {
    const nextValue = opts.get({ get })
    store.dispatch(opts, nextValue)
  }
  function get<A>(state: IHawkState<A>) {
    if (!subscriptions[state.key]) {
      store.subscribe(state, dispatch)
    }
    return store.currentValue(state)
  }
  const initial = opts.get({ get })
  store.dispatch(opts, initial)
  return {
    ...opts
  }
}

export function useHawkState<V>(hawkState: IHawkState<V> | IHawkEyeState<V>) {
  const [state, setState] = useState(store.currentValue(hawkState))
  useEffect(() => store.subscribe(hawkState, setState), [])
  return state
}

export function useHawkSetState<V>(hawkState: IHawkState<V>) {
  return (setter: V | Setter<V>) => {
    if (typeof setter !== 'function') {
      store.dispatch(hawkState, setter)
    } else {
      const currValue = store.currentValue(hawkState)
      const nextValue = typeof setter === 'function' ? (setter as Setter<V>)(currValue) : setter
      store.dispatch(hawkState, nextValue)
    }
  }
}
