import { IListener, IHawkOpts, IHawkState, IHawkEyeOpts, IHawkEyeState } from './react-hawk-types'

export function hawkStore() {
  const previousValues: { [key: string]: any } = {}
  const currentValues: { [key: string]: any } = {}
  const listeners: { [key: string]: IListener[] } = {}
  function subscribe<V>(hawk: IHawkState<V> | IHawkEyeState<V>, listener: IListener<V>) {
    if (!listeners[hawk.key]) listeners[hawk.key] = []
    listeners[hawk.key].push(listener)
    return () => unsubscribe(hawk, listener)
  }
  function unsubscribe<V>(hawk: IHawkState<V> | IHawkEyeState<V>, listener: IListener<V>) {
    if (listeners[hawk.key]) {
      listeners[hawk.key] = listeners[hawk.key].filter(l => l !== listener)
    }
  }
  function dispatch<V>(hawk: IHawkState<V> | IHawkEyeState<V>, value: V) {
    previousValues[hawk.key] = currentValues[hawk.key]
    currentValues[hawk.key] = value
    if (listeners[hawk.key]) {
      listeners[hawk.key].forEach(l => l(value))
    }
  }
  function previousValue<V>(hawk: IHawkState<V> | IHawkEyeState<V>) {
    return previousValues[hawk.key] as V | undefined
  }
  function currentValue<V>(hawk: IHawkState<V> | IHawkEyeState<V>) {
    return currentValues[hawk.key] as V
  }
  return {
    subscribe,
    unsubscribe,
    dispatch,
    previousValue,
    currentValue
  }
}
