import { DeepPartial } from "../types"

export function deepSet<T extends object>(target: T, source: DeepPartial<T>): T {
  //eslint-disable-next-line
  const result: any = {} // can it be typed here? 
  
  if (isObject(target) && isObject(source)) {
    for (const key in target) {
      if (isObject(source[key]) && isObject(target[key])) {
        result[key] = deepSet(target[key], source[key])
      } else {
        result[key] = source[key] ?? target[key]
      }
    }
  }
  
  return result
}


export function deepUpdate<T extends object>(target: T, source: DeepPartial<T>): T {
  //eslint-disable-next-line
  const result: any = {}
  
  if (isObject(target) && isObject(source)) {
    for (const key in target) {
      if (isObject(source[key]) && isObject(target[key])) {
        result[key] = deepUpdate(target[key], source[key])
      } else {
        result[key] = target[key]
        if (isDefined(source[key])) {
          result[key] += source[key]
        }
      }
    }
  }
  
  return result
}

function isObject<T>(item: T | null | undefined): item is NonNullable<T> {
  return isDefined(item) && typeof item === 'object' && !Array.isArray(item)
}

function isDefined<T>(obj: T | null | undefined): obj is NonNullable<T> {
  return obj !== undefined && obj !== null
}
