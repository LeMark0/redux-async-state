import { StateParams } from './types'
import { addArrayToNormalizedList, normalizeList, setLinkedData } from './helpers'

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
  const { prevState, response } = stateParams
  const { parentId, resultKey = 'data', withMerging, keyProp } = transformParams

  if (resultKey !== 'data' && parentId) {
    return setLinkedData(prevState.result, parentId, response, resultKey)
  }

  const list = Array.isArray(response) ? response : [response]

  return withMerging
    ? addArrayToNormalizedList(prevState.result, list, keyProp)
    : normalizeList(list, keyProp)
}
