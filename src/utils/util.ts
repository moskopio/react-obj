
export function isObject<T>(item: T | null | undefined): item is T {
  return isDefined(item) && typeof item === 'object' && !Array.isArray(item)
}

export function isDefined<T>(obj: T | null | undefined): obj is NonNullable<T> {
  return obj !== undefined && obj !== null
}
