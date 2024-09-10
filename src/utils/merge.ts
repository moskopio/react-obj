import { DeepPartial } from "src/types"
import { isDefined, isObject } from "./util"

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
