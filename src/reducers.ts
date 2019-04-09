import {
  State,
  AsyncActionWithDefaults,
  Action,
  Reducer,
  TransformFunction,
  TransformParams,
  TransformErrorFunction,
} from './types'
import { get, set, isEmpty, merge } from 'lodash'
import { AsyncState } from './AsyncState'
import { actionTypePrefix, actionTypes, defaultPath } from './constants'
import { defaultTransformer, transformAxiosError } from './transformers'

/**
 * Collect async statuses to root domain
 */
const collectAsyncStatus = (state: State, path: string, isFetching: boolean): State => ({
  ...state,
  [defaultPath]: {
    ...state.async,
    [path]: {
      ...state.async[path],
      isFetching,
    },
  },
})

/**
 * Creates new AsyncState with given isFetching
 */
export function setIsFetching<T>(asyncState: AsyncState<T>, isFetching: boolean) {
  return {
    ...asyncState,
    isFetching,
  }
}

/**
 * Creates new AsyncState with given result
 */
type SetResultParams<T> = {
  action: Action
  asyncState: AsyncState<T>
  transform: TransformFunction
  transformParams?: TransformParams
}
export function setResult<T>({
  action,
  asyncState,
  transform,
  transformParams,
}: SetResultParams<T>): AsyncState<T> {
  const { data } = action.payload

  const transformedData = transform(
    {
      prevState: asyncState,
      response: data,
      action,
    },
    transformParams,
  )

  return {
    ...asyncState,
    error: undefined,
    rawResponse: data,
    result: {
      ...asyncState.result,
      ...transformedData,
    },
  }
}

/**
 * Apply request reducer to asyncState with current action
 */
function getNextState<T>(state: State, action: Action, reducer: Reducer<T>): State {
  const {
    payload: { path },
  } = action

  if (path) {
    const slicedState = get(state, path) as AsyncState<T>
    const nextState = reducer(slicedState, action)

    const collectedState = collectAsyncStatus(state, path, nextState.isFetching)

    return set(collectedState, path, nextState)
  }

  return state
}

/**
 * Create new AsyncState when request is pending
 */
function prepareStateRequest<T>(
  asyncState = new AsyncState<T>(),
  action: AsyncActionWithDefaults,
): AsyncState<T> {
  const {
    payload: { transform, transformParams },
  } = action

  return {
    ...setIsFetching<T>(asyncState, true),
    isSuccess: false,
    // keep previous data if it exists or create initial asyncState
    result: isEmpty(asyncState.result)
      ? transform({ prevState: asyncState, action }, transformParams)
      : asyncState.result,
  }
}

/**
 * Create new AsyncState with given result
 */
function prepareStateSuccess<T>(
  asyncState: AsyncState<T>,
  action: AsyncActionWithDefaults,
): AsyncState<T> {
  const { isAction, transform, transformParams } = action.payload
  if (isAction) {
    return { ...setIsFetching(asyncState, false), isSuccess: true }
  }
  return setResult({
    asyncState: { ...setIsFetching(asyncState, false), isSuccess: true },
    action,
    transform,
    transformParams,
  })
}

/**
 * Create new AsyncState when request is failed
 */
type FailAction = AsyncActionWithDefaults & {
  payload: {
    error: any
    transformError: TransformErrorFunction
  }
}
function prepareStateFail<T>(state: AsyncState<T>, action: FailAction): AsyncState<T> {
  const { error, transformError } = action.payload

  const errorTransformed = transformError(error)

  return {
    ...setIsFetching(state, false),
    isFetching: false,
    isSuccess: false,
    error: errorTransformed,
  }
}

const initialState = {
  async: {},
}

type Config = {
  transform?: TransformFunction
  transformError?: TransformErrorFunction
}

export const asyncReducer = (
  rootState: State = initialState,
  action: Action,
  config?: Config,
) => {
  console.log('asyncReducer.rootState: ', rootState)
  console.log('asyncReducer.action: ', action)

  if (action) {
    const matched = new RegExp(
      `^${actionTypePrefix}\\/(.*)(${actionTypes.Success}|${actionTypes.Fail}|${
        actionTypes.Request
      })\\b`,
      'g',
    ).exec(action.type)

    if (matched) {
      const asyncActionType = matched[matched.length - 1]

      const defaults = {
        transform: get(config, 'transform', defaultTransformer),
        transformError: get(config, 'transformError', transformAxiosError),
      }

      const actionWithDefaults = {
        ...action,
        payload: merge(defaults, action.payload)
      }

      console.log('actionWithDefaults: ', actionWithDefaults)

      switch (asyncActionType) {
        case actionTypes.Request:
          return getNextState(rootState, actionWithDefaults, prepareStateRequest)
        case actionTypes.Success:
          return getNextState(rootState, actionWithDefaults, prepareStateSuccess)
        case actionTypes.Fail:
          return getNextState(rootState, actionWithDefaults, prepareStateFail)
        default:
          return rootState
      }
    }
  }

  return rootState
}
