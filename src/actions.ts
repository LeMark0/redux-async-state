import { Dispatch } from 'redux'
import { AsyncAction, Request, Success, Fail, Action, ApiResponse } from './types'
import { makeType } from './helpers'
import { actionTypes, defaultPath } from './constants'
import { defaultTransformer, transformAxiosError } from './transformers'

type RequestActionPayload = {
  path?: string
  actionType?: string
  isAction?: boolean
}
type RequestAction = Action & {
  payload: RequestActionPayload
}

// export const request = ({
//   resource,
//   params = {},
//   path,
//   actionType = '',
//   isAction = false,
//   onSuccessAction,
//   onErrorAction,
//   onSuccess,
//   onError,
//   transform = defaultTransformer,
// }: Request): AsyncAction => ({
//   type: makeType(actionType, actionTypes.Request),
//   payload: {
//     resource,
//     params,
//     path,
//     actionType,
//     isAction,
//     onSuccessAction,
//     onErrorAction,
//     onSuccess,
//     onError,
//     transform,
//   },
// })

export const request = ({
  path,
  actionType,
  isAction,
  transform,
  transformParams,
  transformError,
}: Request): Action => ({
  type: makeType(actionType, actionTypes.Request),
  payload: {
    path,
    actionType,
    isAction,
    transform,
    transformParams,
    transformError,
  },
})

export const success = <T = any>({
  path = defaultPath,
  data,
  actionType,
  isAction,
  transform,
  transformParams,
}: Success<T>): Action => ({
  type: makeType(actionType, actionTypes.Success),
  payload: {
    path,
    data,
    actionType,
    isAction,
    transform,
    transformParams,
  },
})

export const fail = <T = any>({
  path = defaultPath,
  error,
  transformError,
  actionType,
}: Fail<T>): Action => ({
  type: makeType(actionType, actionTypes.Fail),
  payload: {
    path,
    error,
    transformError,
    actionType,
  },
})

// TODO: set defaults
export const asyncRequest = ({
  params = {},
  isAction = false,
  actionType = '',
  ...rest
}: Request) => async (dispatch: Dispatch) => {
  const requestParams = { params, isAction, actionType, ...rest }

  console.log('asyncRequest.requestParams: ', requestParams)

  dispatch(request(requestParams))
  try {
    const { resource, params } = requestParams
    const response: ApiResponse = await resource(params)

    dispatch(success({ ...requestParams, data: response.data }))
  } catch (error) {
    dispatch(fail({ ...requestParams, error }))
  }
}
