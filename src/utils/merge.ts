import { DeepPartial } from "../types"



export function deepSet<T>(target: T, source: T | DeepPartial<T>): T {
  return deepMerge(target, source, false)
}

export function deepUpdate<T>(target: T, source: T | DeepPartial<T>): T {
  return deepMerge(target, source, true)
}

function deepMerge<T>(target: T, source: T | DeepPartial<T>, isAdditive = false): T {
  //eslint-disable-next-line
  const result: any = {} // can it be typed here? 
  
  if (isObject(target) && isObject(source)) {
    for (const key in target) {
      if (isObject(source[key]) && isObject(target[key])) {
        result[key] = deepMerge(target[key], source[key], isAdditive)
      } else {
        result[key] = source[key] ?? target[key]
        isDefined(source[key]) && isAdditive && (result[key] += target[key])
      }
    }
  }
  
  return result
}

function isObject<T>(item: T | null | undefined): item is T {
  return isDefined(item) && typeof item === 'object' && !Array.isArray(item)
}

function isDefined<T>(obj: T | null | undefined): obj is NonNullable<T> {
  return obj !== undefined && obj !== null
}
