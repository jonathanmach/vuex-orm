export interface Dictionary<T> {
  [key: string]: T
}

export type Predicate<T> = (value: T, key: string) => boolean

export type ObjectIteratee<T extends object, TResult> = (value: T[keyof T], key: string, object: T) => TResult

interface SortableArray<T> {
  criteria: any[]
  index: number
  value: T
}

/**
 * Gets the size of collection by returning its length for array-like values
 * or the number of own enumerable string keyed properties for objects.
 */
export function size (collection: any[] | object): number {
  return Array.isArray(collection) ? collection.length : Object.keys(collection).length
}

/**
 * Check if the given array or object is empty.
 */
export function isEmpty (collection: any[] | object): boolean {
  return size(collection) === 0
}

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property.
 */
export function forOwn<T extends object> (object: T, iteratee: ObjectIteratee<T, void>): void {
  Object.keys(object).forEach(key => iteratee(object[key], key, object))
}

/**
 * Creates an array of values by running each element in collection thru
 * iteratee. The iteratee is invoked with three arguments:
 * (value, key, collection).
 */
export function map<T extends object, TResult> (object: T, iteratee: ObjectIteratee<T, TResult>): TResult[] {
  const result: TResult[] = []

  for (const key in object) {
    result.push(iteratee(object[key], key, object))
  }

  return result
}

/**
 * Creates an object with the same keys as object and values generated by
 * running each own enumerable string keyed property of object thru
 * iteratee. The iteratee is invoked with three arguments:
 * (value, key, object).
 */
export function mapValues<T extends object, TResult> (object: T, iteratee: ObjectIteratee<T, TResult>): Dictionary<TResult> {
  const newObject = Object.assign({}, object)

  return Object.keys(object).reduce((records, key) => {
    records[key] = iteratee(object[key], key, object)
    return records
  }, newObject)
}

/**
 * Creates an object composed of keys generated from the results of running
 * each element of collection by the given key.
 */
export function keyBy<T extends object> (collection: T[], key: string): Record<string, T> {
  const o: Record<string, T> = {}

  collection.forEach((item) => {
    o[item[key]] = item
  })

  return o
}

/**
 * Creates an array of elements, sorted in specified order by the results
 * of running each element in a collection thru each iteratee.
 */
export function orderBy<T> (collection: T[], iteratees: (((record: T) => any) | string)[], directions: string[]): T[] {
  let index = -1

  const result = collection.map((value) => {
    const criteria = iteratees.map((iteratee) => {
      return typeof iteratee === 'function' ? iteratee(value) : value[iteratee]
    })

    return { criteria, index: ++index, value }
  })

  return baseSortBy(result, (object, other) => {
    return compareMultiple(object, other, directions)
  })
}

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order
 * of equal elements.
 */
function baseSortBy<T> (array: SortableArray<T>[], comparer: (a: SortableArray<T>, B: SortableArray<T>) => number): T[] {
  let length = array.length

  array.sort(comparer)

  const newArray: T[] = []
  while (length--) {
    newArray[length] = array[length].value
  }
  return newArray
}

/**
 * Used by `orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order.
 * Otherwise, specify an order of "desc" for descending or "asc" for
 * ascending sort order of corresponding values.
 */
function compareMultiple (object: any, other: any, orders: string[]): number {
  let index = -1

  const objCriteria = object.criteria
  const othCriteria = other.criteria
  const length = objCriteria.length
  const ordersLength = orders.length

  while (++index < length) {
    const result = compareAscending(objCriteria[index], othCriteria[index])

    if (result) {
      if (index >= ordersLength) {
        return result
      }

      const order = orders[index]

      return result * (order === 'desc' ? -1 : 1)
    }
  }

  return object.index - other.index
}

/**
 * Compares values to sort them in ascending order.
 */
function compareAscending (value: any, other: any): number {
  if (value !== other) {
    const valIsDefined = value !== undefined
    const valIsNull = value === null
    const valIsReflexive = value === value

    const othIsDefined = other !== undefined
    const othIsNull = other === null
    const othIsReflexive = other === other

    if (typeof value !== 'number' || typeof other !== 'number') {
      value = String(value)
      other = String(other)
    }

    if (
      (!othIsNull && value > other) ||
      (valIsNull && othIsDefined && othIsReflexive) ||
      (!valIsDefined && othIsReflexive) ||
      !valIsReflexive
    ) {
      return 1
    }

    if (
      (!valIsNull && value < other) ||
      (othIsNull && valIsDefined && valIsReflexive) ||
      (!othIsDefined && valIsReflexive) ||
      !othIsReflexive
    ) {
      return -1
    }
  }

  return 0
}

/**
 * Creates an object composed of keys generated from the results of running
 * each element of collection thru iteratee.
 */
export function groupBy (collection: any[], iteratee: (record: any) => any): any {
  return collection.reduce((records, record) => {
    const key = iteratee(record)

    if (records[key] === undefined) {
      records[key] = []
    }

    records[key].push(record)

    return records
  }, {} as any)
}

/**
 * Creates a deep clone of an object or array.
 */
export function cloneDeep (data: any): any {
  if (data === null) {
    return null
  }

  const clone = Object.assign({}, data)

  Object.keys(clone).forEach(
    key => (clone[key] = typeof data[key] === 'object' ? cloneDeep(data[key]) : data[key])
  )

  return Array.isArray(data) && data.length
    ? (clone.length = data.length) && Array.from(clone)
    : Array.isArray(data)
      ? Array.from(data)
      : clone
}

export default {
  size,
  isEmpty,
  forOwn,
  map,
  mapValues,
  keyBy,
  orderBy,
  groupBy,
  cloneDeep
}
