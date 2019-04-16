import { AnyAction, Dispatch, Store } from 'redux'
// import { get, merge } from 'lodash'
import {
  Action,
  AsyncAction,
} from './types'
// import { defaultTransformer, transformAxiosError } from './transformers'
// import { actionTypePrefix, actionTypes, defaultPath } from './constants'

type ActionCreator = (dispatch: Dispatch, getState: () => object) => Action
//
// type Config = {
//   transform?: TransformFunction
//   transformError?: TransformErrorFunction
//   onSuccessAction?: Callback | Callback[]
// }
//
// export const asyncStateMiddleware = (config?: Config) => (store: Store) => (
//   next: Dispatch<AnyAction>,
// ) => (action: AsyncAction | ActionCreator | Action) => {
//   if (typeof action === 'function') {
//     return action.name === 'asyncRequestAction'
//       ? action(store.dispatch, store.getState)
//       : action
//   }
//
//   const matched = new RegExp(
//     `^${actionTypePrefix}\\/(.*)(${actionTypes.Success}|${actionTypes.Fail}|${
//       actionTypes.Request
//     })\\b`,
//     'g',
//   ).exec(action.type)
//
//   if (matched) {
//     const defaults = {
//       path: defaultPath,
//       params: {},
//       isMutation: false,
//       actionType: '',
//       transform: get(config, 'transform', defaultTransformer),
//       transformError: get(config, 'transformError', transformAxiosError),
//       onSuccessAction: get(config, 'onSuccessAction'),
//       defaultsSet: get(config, 'defaultsSet', 'default params'),
//     }
//
//     const actionWithDefaults = {
//       ...action,
//       payload: merge(defaults, action.payload),
//     }
//
//     console.log('action: ', action)
//     console.log('defaults: ', defaults)
//     console.log('actionWithDefaults: ', actionWithDefaults)
//
//     return next(actionWithDefaults)
//   }
//
//   return next(action)
// }

export const asyncStateMiddleware = (store: Store) => (
  next: Dispatch<AnyAction>,
) => (action: AsyncAction | ActionCreator | Action) => {
  if (typeof action === 'function') {
    return action.name === 'asyncRequestAction'
      ? action(store.dispatch, store.getState)
      : action
  }

  return next(action)
}
