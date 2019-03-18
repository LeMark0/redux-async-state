import { Entity, Normalized } from './types'
import { actionTypePrefix, normalizedInitial } from './constants'

export const makeType = (actionType: string = '', status: string = ''): string =>
  [actionTypePrefix, actionType, status].filter(Boolean).join('/')

/**
 * Create key from given array of fields values
 */
export function createKey(list: string[] = []): string {
  return list.join('_')
}

/**
 * Get string key based on object's property or list of properties
 */
export function getKey<T>(item?: T, keyProp: string | string[] = ''): string {
  if (!item) {
    return ''
  }
  if (Array.isArray(keyProp)) {
    return createKey(
      keyProp.reduce((result, prop) => {
        const key = item[prop]

        if (key) {
          return [...result, key]
        }
        return result
      }, []),
    )
  }

  return item[keyProp] || ''
}

/**
 * Make array from normalized list object
 */
export function denormalizeList<T>(normalized: Normalized<T> = normalizedInitial): T[] {
  return normalized.ids.map(id => normalized.data[id])
}

function makeOrderedObject<T = Entity>(
  list: T[] = [],
  keyProp: string | string[] = 'id',
  preserveInitial: boolean = false,
  initial: Normalized<T> = normalizedInitial,
): Normalized<T> {
  return list.reduce((result, item, index) => {
    const key = getKey(item, keyProp) || index

    if (!preserveInitial) {
      // shallow merge data
      const updatedData = {
        ...result,
        data: {
          ...result.data,
          [key]: item,
        },
      }

      // add id if it's new
      if (!result.data[key]) {
        return {
          ...updatedData,
          ids: [...result.ids, key],
          denormalized: [...result.denormalized, item],
        }
      }
      // or just update
      return {
        ...updatedData,
        // it's better to recreate list then look for updated item
        denormalized: denormalizeList(updatedData),
      }
    }

    if (!result.data[key]) {
      // need to add
      return {
        ...result,
        ids: [...result.ids, key],
        denormalized: [...result.denormalized, item],
        data: { ...result.data, [key]: item },
      }
    }

    return result
  }, initial)
}

/**
 * Set linked to ids data to {dataField}
 */
export function setLinkedData<T = Entity>(
  normalized: Normalized<T> = normalizedInitial,
  id: string | number,
  data: any,
  dataField: string,
): Normalized<T> {
  if (id && dataField) {
    return {
      ...normalized,
      [dataField]: {
        ...normalized[dataField],
        [id]: data,
      },
    }
  }

  return { ...normalized }
}

export function normalizeList<T = Entity>(
  list: T[] = [],
  keyProp?: string | string[],
): Normalized<T> {
  return makeOrderedObject(list, keyProp)
}

/**
 * Adds new array data to normalized list object
 */
export function addArrayToNormalizedList<T = Entity>(
  normalized: Normalized<T> = normalizedInitial,
  list: T[],
  keyProp: string | string[] = 'id',
  keepExistingItems: boolean = false,
): Normalized<T> {
  return makeOrderedObject(list, keyProp, keepExistingItems, normalized)
}
