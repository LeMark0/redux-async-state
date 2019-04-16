import { Dispatch } from 'redux'
import { get, merge } from 'lodash'

import { Request, Success, Fail, Action, ApiResponse, CallbackAction } from './types'
import { makeType } from './helpers'
import { actionTypes, defaultPath } from './constants'
import { defaultTransformer, transformAxiosError } from './transformers'

export const request = ({
  path,
  actionType,
  isMutation,
  transform,
  transformParams,
  transformError,
}: Request): Action => ({
  type: makeType(actionType, actionTypes.Request),
  payload: {
    path,
    actionType,
    isMutation,
    transform,
    transformParams,
    transformError,
  },
})

export const success = <T = any>({
  path,
  data,
  actionType,
  isMutation,
  transform,
  transformParams,
}: Success<T>): Action => ({
  type: makeType(actionType, actionTypes.Success),
  payload: {
    path,
    data,
    actionType,
    isMutation,
    transform,
    transformParams,
  },
})

// TODO pass all Request fields to these actions?
export const fail = <T = any>({
  path,
  error,
  actionType,
  isMutation,
  transformError,
}: Fail<T>): Action => ({
  type: makeType(actionType, actionTypes.Fail),
  payload: {
    path,
    error,
    actionType,
    isMutation,
    transformError,
  },
})

type Config = {
  transform?: Request['transform']
  transformError?: Request['transformError']
  onSuccessAction?: Request['onSuccessAction']
}

function composeHandlers(
  defaultHandler?: CallbackAction | CallbackAction[],
  handler?: CallbackAction | CallbackAction[],
): CallbackAction[] | undefined {
  if (!defaultHandler && !handler) {
    return
  }

  return [defaultHandler, handler].flat().filter(Boolean)
}

export const asyncRequest = (config?: Config) => (requestParams: Request) =>
  async function asyncRequestAction(dispatch: Dispatch) {
    const defaults = {
      path: defaultPath,
      params: {},
      isMutation: false,
      actionType: '',
      transform: get(config, 'transform', defaultTransformer),
      transformError: get(config, 'transformError', transformAxiosError),
    }

    const requestParamsWithDefaults = merge(defaults, {
      ...requestParams,
      onSuccessAction: composeHandlers(
        get(config, 'onSuccessAction'),
        requestParams.onSuccessAction,
      ),
      onErrorAction: composeHandlers(
        get(config, 'onErrorAction'),
        requestParams.onErrorAction,
      ),
    })

    console.log('requestParamsWithDefaults: ', requestParamsWithDefaults)

    dispatch(request(requestParamsWithDefaults))
    try {
      const { resource, params, onSuccessAction, onSuccess } = requestParamsWithDefaults
      const response: ApiResponse = await resource(params)

      const successAction = success({ ...requestParamsWithDefaults, data: response.data })
      dispatch(successAction)

      if (onSuccess) {
        onSuccess(response, successAction)
      }

      if (onSuccessAction) {
        onSuccessAction.map(step => dispatch(step(response, successAction)))
      }
    } catch (error) {
      const { onErrorAction, onError } = requestParamsWithDefaults

      console.log('onErrorAction: ', onErrorAction)
      console.log('dispatch: ', dispatch)

      const errorAction = fail({ ...requestParamsWithDefaults, error })
      dispatch(errorAction)

      if (onError) {
        onError(error, errorAction)
      }

      if (onErrorAction) {
        onErrorAction.map(step => dispatch(step(error, errorAction)))
      }
    }
  }
