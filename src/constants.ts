export const actionTypePrefix = 'async'
export const defaultPath = 'async'

export enum actionTypes {
  request = 'REQUEST',
  success = 'SUCCESS',
  fail = 'FAIL',
}

export const normalizedInitial = { ids: [], data: {}, denormalized: [] }
