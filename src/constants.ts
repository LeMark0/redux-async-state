export const actionTypePrefix = 'async'
export const defaultPath = 'async'

export enum actionTypes {
  Request = 'REQUEST',
  Success = 'SUCCESS',
  Fail = 'FAIL',
}

export const normalizedInitial = { ids: [], data: {}, denormalized: [] }
