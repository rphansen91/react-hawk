export type IListener<V = any> = (v: V) => any
export type IHawkOpts<V> = {
  key: string
  default: V
}
export type IHawkState<V> = {
  key: string
  default: V
}
export type IHawkEyeOpts<V> = {
  key: string
  get: (d: { get: <A>(s: IHawkState<A>) => A }) => V
}
export type IHawkEyeState<V> = {
  key: string
  get: (d: { get: <A>(s: IHawkState<A>) => A }) => V
}
export type Setter<V> = (v: V) => V
