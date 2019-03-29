import { AsyncError, Normalized } from './types'
import { normalizedInitial } from './constants'

// TODO replace by normalised type
// export type AsyncStateResult<T> = {
//   ids: string[]
//   data: { [key: string]: T[] }
//   denormalized: T[]
// }

export class AsyncState<T> {
  constructor(keys: string[] = [], initialResult: Normalized<T> = normalizedInitial) {
    this.result = keys.reduce(
      (result, key) =>
        ({
          ...result,
          [key]: {},
        } as Normalized<T>),
      initialResult,
    )
  }
  result: Normalized<T>
  isFetching: boolean = false
  isSuccess: boolean = false
  error?: AsyncError
  rawResponse?: T | T[]
}
