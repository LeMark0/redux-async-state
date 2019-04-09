import { AnyAction, Dispatch, Store } from 'redux'
import { Action, AsyncAction, TransformFunction, TransformErrorFunction } from './types'
import { defaultTransformer, transformAxiosError } from './transformers'
import { actionTypePrefix, actionTypes } from './constants'

type ActionCreator = (dispatch: Dispatch, getState: () => object) => Action

export const asyncStateMiddleware = (store: Store) => (
  next: Dispatch<AnyAction>,
) => (action: AsyncAction | ActionCreator) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState)
  }

  // const matched = new RegExp(
  //   `^${actionTypePrefix}\\/(.*)(${actionTypes.Request})\\b`,
  //   'g',
  // ).test(action.type)
  //
  // if (matched) {
  //   // if transform undefined then set default
  //   // if transform passed to config set default = passed
  //   // if transform passed to action set passed
  //
  //   const defaults = config
  //     ? {
  //         transform: config.transform || defaultTransformer,
  //         transformError: config.transformError || transformAxiosError,
  //       }
  //     : {}
  //
  //   action.payload = {
  //     ...defaults,
  //     ...action.payload,
  //   }
  // }

  return next(action)
}

// export const asyncStateMiddleware = (store: Store) => (next: Dispatch<AnyAction>) => (
//   action: Action,
// ) => {
//   console.log('asyncStateMiddleware.action: ', action)
//   const matched = new RegExp(
//     `^${actionTypePrefix}\\/(.*)(${actionTypes.Request})\\b`,
//     'g',
//   ).test(action.type)
//   // console.log('asyncStateMiddleware.matched: ', matched)
//
//   const rootState = store.getState()
//   console.log('asyncStateMiddleware.rootState: ', rootState)
//
//   // return asyncReducer(rootState, action)
//
//
//   return next(action)
// }

//
// export default function* asyncSaga() {
//   yield takeEvery(
//     action =>
//       new RegExp(`^${actionTypePrefix}\\/(.*)(${actionTypes.request})\\b`, 'g').test(
//         action.type,
//       ),
//     asyncRequest,
//   )
// }
