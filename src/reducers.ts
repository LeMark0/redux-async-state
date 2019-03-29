import {
  State,
  AsyncAction,
  Action,
  Reducer,
  TransformFunction,
  TransformParams,
  AsyncError,
} from './types'
import { get, set, isEmpty } from 'lodash'
import { AsyncState } from './AsyncState'
import { actionTypePrefix, actionTypes } from './constants'

/**
 * Collect async statuses to root domain
 */
const collectAsyncStatus = (state: State, path: string, isFetching: boolean): State => ({
  ...state,
  async: {
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
  transformParams: TransformParams
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
  action: AsyncAction,
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
  action: Action,
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
function prepareStateFail<T>(state: AsyncState<T>, action: Action): AsyncState<T> {
  const { error }: { error?: AsyncError } = action.payload
  return {
    ...setIsFetching(state, false),
    isFetching: false,
    isSuccess: false,
    error,
  }
}

export const asyncReducer = (rootState: State, action: Action) => {
  const matched = new RegExp(
    `^${actionTypePrefix}\\/(.*)(${actionTypes.Success}|${actionTypes.Fail}|${
      actionTypes.Request
    })\\b`,
    'g',
  ).exec(action.type)

  if (matched) {
    const asyncActionType = matched[matched.length - 1]

    switch (asyncActionType) {
      case actionTypes.Request:
        return getNextState(rootState, action, prepareStateRequest)
      case actionTypes.Success:
        return getNextState(rootState, action, prepareStateSuccess)
      case actionTypes.Fail:
        return getNextState(rootState, action, prepareStateFail)
      default:
        return rootState
    }
  }

  return rootState
}
