import { Action, StateParams, Request } from './types'
import {
  makeType,
  setLinkedData,
  addArrayToNormalizedList,
  normalizeList,
} from './helpers'
import { defaultPath, actionTypes } from './constants'

type DefaultTransformFunctionParams = {
  withMerging?: boolean
  keyProp?: string
  parentId?: string
  resultKey?: string
}

export const defaultTransformer = (
  stateParams: StateParams,
  transformParams: DefaultTransformFunctionParams = {},
) => {
  const { prevResult, response } = stateParams
  const { parentId, resultKey = 'data', withMerging, keyProp } = transformParams

  if (resultKey !== 'data' && parentId) {
    return setLinkedData(prevResult, parentId, response, resultKey)
  }

  const list = Array.isArray(response) ? response : [response]

  return withMerging
    ? addArrayToNormalizedList(prevResult, list, keyProp)
    : normalizeList(list, keyProp)
}

// public API: reducer
export const request = ({
  resource,
  params = {},
  path = defaultPath,
  actionType = '',
  isAction = false,
  onSuccessAction,
  onErrorAction,
  onSuccess,
  onError,
  transform = defaultTransformer,
}: Request): Action => ({
  type: makeType(actionType, actionTypes.request),
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

// public API: middleware TODO
