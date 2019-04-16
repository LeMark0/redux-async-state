/** custom transform params for a specific transform function **/

import { AsyncState } from '../AsyncState'

type ID = string | number

export type Dictionary = {
  error?: AsyncError
  [_: string]: any
}

export type LinkedData = { [id in ID]: any }

export type Action = {
  type: string
  payload: Dictionary
}

export type Reducer<T> = (state: AsyncState<T>, action?: Action) => AsyncState<T>

export type TransformParams = { [index: string]: any }

export type StateParams<T = any> = {
  /** saved in store value **/
  prevState: AsyncState<T>
  /** current redux action **/
  action?: Action
  /** api response body **/
  response?: T | T[]
}

export type TransformFunction = (
  stateParams: StateParams,
  transformParams?: TransformParams,
) => any

export type TransformErrorFunction = (error: any) => any

export type AsyncAction = {
  type: string
  payload: Request
}

export type AsyncActionWithDefaults = AsyncAction & {
  payload: RequestWithDefaults
}

export type Callback = (response: object, action: Action) => any
export type CallbackAction = (response: any, action: Action) => any

export type State = {
  async: object
  [_: string]: any
}

export type Entity = object

export type Normalized<T> = {
  ids: ID[]
  data: { [id in ID]: T }
  denormalized: T[]
  [additionalField: string]: LinkedData
}

export type AsyncError = {
  status?: number
  statusText?: string
  message?: string
}

export type Request = {
  /** Api resource function */
  resource: (...args: any[]) => Promise<any>
  /** Request params */
  params?: object
  /** Path in store where result must be saved */
  path?: string
  /** type property of redux action **/
  actionType?: string
  // /** If need to keep saved data, use it for POST, PATCH, PUT */
  isMutation?: boolean
  // isMutation
  // /** Action description for status message */
  // actionDesc?: string
  /** Success callback or array of callbacks */
  onSuccessAction?: CallbackAction | CallbackAction[]
  /** Error callback or array of callbacks */
  onErrorAction?: CallbackAction | CallbackAction[]
  /** Success callback */
  onSuccess?: Callback
  /** Error callback */
  onError?: Callback
  /** Transform function for response */
  transform?: TransformFunction
  transformParams?: TransformParams
  transformError?: TransformErrorFunction
}

// TODO del?
export type RequestWithDefaults = Request & {
  transform: TransformFunction
  transformError: TransformErrorFunction
}

export type Success<T> = {
  path?: string
  data?: T
  actionType?: string
  isMutation?: boolean
  transform?: TransformFunction
  transformParams?: TransformParams
}

export type Fail<T> = {
  path?: string
  error?: T
  actionType?: string
  isMutation?: boolean
  transformError?: TransformErrorFunction
}

// TODO type better
export type ApiResponse = {
  data: any
}

