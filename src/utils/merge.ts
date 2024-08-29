import { DeepPartial } from "../types"



export function mergeSet<T extends object>(...sources: Array<DeepPartial<T>>): T {
  return deepMergeSet({} as T, ...sources)
}

export function mergeUpdate<T extends object>(...sources: Array<DeepPartial<T>>): T {
  return deepMergeUpdate({} as T, ...sources)
}

function isObject(item: any): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

function deepMergeSet<T extends object>(target: T, ...sources: Array<Partial<T>>): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key]
        if (isObject(sourceValue) && isObject(target[key])) {
          target[key] = deepMergeSet(target[key] as any, sourceValue as any)
        } else {
          (target as any)[key] = sourceValue
        }
      }
    }
  }
  
  return deepMergeSet(target, ...sources)
}


function deepMergeUpdate<T extends object>(target: T, ...sources: Array<Partial<T>>): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key]
        if (isObject(sourceValue) && isObject(target[key])) {
          target[key] = deepMergeUpdate(target[key] as any, sourceValue as any)
        } else if (target[key]) {
          (target as any)[key] += sourceValue
        } else {
          (target as any)[key] = sourceValue
        }
      }
    }
  }
  
  return deepMergeUpdate(target, ...sources)
}
