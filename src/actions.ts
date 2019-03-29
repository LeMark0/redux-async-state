import { AsyncAction, Request, Success, Fail, Action } from './types'
import { makeType } from './helpers'
import { actionTypes, defaultPath } from './constants'
import { defaultTransformer } from './transformers'

export const request = ({
  resource,
  params = {},
  path,
  actionType = '',
  isAction = false,
  onSuccessAction,
  onErrorAction,
  onSuccess,
  onError,
  transform = defaultTransformer,
}: Request): AsyncAction => ({
  type: makeType(actionType, actionTypes.Request),
  payload: {
    resource,
    params,
    path,
    actionType,
    isAction,
    onSuccessAction,
    onErrorAction,
    onSuccess,
    onError,
    transform,
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
  actionType,
}: Fail<T>): Action => ({
  type: makeType(actionType, actionTypes.Fail),
  payload: {
    path,
    error,
    actionType,
  },
})
