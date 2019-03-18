import { AsyncError } from './types'
import { normalizedInitial } from './constants'

export type AsyncStateResult<T> = {
  ids: string[]
  data: { [key: string]: T[] }
  denormalized: T[]
}

export class AsyncState<T> {
  constructor(
    keys: string[] = [],
    initialResult: AsyncStateResult<T> = normalizedInitial,
  ) {
    this.result = keys.reduce(
      (result, key) =>
        ({
          ...result,
          [key]: {},
        } as AsyncStateResult<T>),
      initialResult,
    )
  }
  result: AsyncStateResult<T>
  isFetching: boolean = false
  isSuccess: boolean = false
  error?: AsyncError
  rawResponse: T
}
