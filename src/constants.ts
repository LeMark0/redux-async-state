// TODO fix names
export const actionTypePrefix = 'async-new'
export const defaultPath = 'asyncGlobal'

export enum actionTypes {
  Request = 'REQUEST',
  Success = 'SUCCESS',
  Fail = 'FAIL',
}

export const normalizedInitial = { ids: [], data: {}, denormalized: [] }
