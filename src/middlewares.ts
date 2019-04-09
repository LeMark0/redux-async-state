import { AnyAction, Dispatch, Store } from 'redux'
import { Action, AsyncAction } from './types'

type ActionCreator = (dispatch: Dispatch, getState: () => object) => Action

export const asyncStateMiddleware = (store: Store) => (
  next: Dispatch<AnyAction>,
) => (action: AsyncAction | ActionCreator) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState)
  }

  return next(action)
}
