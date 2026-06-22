import { DeepPartial } from "src/types"
import { isDefined, isObject } from "./util"

export function deepSet<T>(target: T, source: T | DeepPartial<T>): T {
  return deepMerge(target, source, false)
}

export function deepUpdate<T>(target: T, source: T | DeepPartial<T>): T {
  return deepMerge(target, source, true)
}

function deepMerge<T>(target: T, source: T | DeepPartial<T>, isAdditive = false): T {
  const result = {} as Record<keyof T, T[keyof T]>
  
  if (isObject(target) && isObject(source)) {
    for (const key in target) {
      if (isObject(source[key]) && isObject(target[key])) {
        result[key] = deepMerge(target[key], source[key], isAdditive) as T[keyof T]
      } else {
        result[key] = (source[key] ?? target[key]) as T[keyof T]
        if (isDefined(source[key]) && isAdditive) {
          const updatedValue = (result[key] as number) + (target[key] as number)
          result[key] = updatedValue as T[keyof T]
        }
      }
    }
  }
  
  return result as T
}

