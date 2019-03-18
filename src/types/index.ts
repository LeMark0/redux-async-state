/** custom transform params for a specific transform function **/
export type TransformParams = { [index: string]: any }

export type StateParams<T = any> = {
  /** saved in store value **/
  prevResult?: any
  /** current redux action **/
  action?: Action
  /** api response body **/
  response?: T | T[]
}

export type TransformFunction = (
  stateParams: StateParams,
  transformParams?: TransformParams,
) => any

export type Request = {
  /** Api resource function */
  resource: (...args: any[]) => void
  /** Request params */
  params?: object
  /** Path in store where result must be saved */
  path?: string
  /** type property of redux action **/
  actionType?: string
  /** If need to keep saved data, use it for POST, PATCH, PUT */
  isAction?: boolean
  // /** Action description for status message */
  // actionDesc?: string
  /** Success callback or array of callbacks */
  onSuccessAction?: Callback | Callback[]
  /** Error callback or array of callbacks */
  onErrorAction?: Callback | Callback[]
  /** Success callback */
  onSuccess?: Callback | Callback[]
  /** Error callback */
  onError?: Callback | Callback[]
  /** Transform function for response */
  transform?: TransformFunction
  /** TODO pass PARAMS? **/
  transformParams?: TransformParams
}

export type Action = {
  type: string
  payload: Request
}

export type Callback = (response: object) => void

export type State = {
  async: object
  [_: string]: any
}

export type Entity = object

type ID = string | number

export type Normalized<T> = {
  ids: ID[]
  data: { [id in ID]: T }
  denormalized: T[]
}

export type AsyncError = {
  status?: number
  statusText?: string
  message?: string
}
