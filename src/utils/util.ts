
export function isObject<T>(item: T | null | undefined): item is T {
  return isDefined(item) && typeof item === 'object' && !Array.isArray(item)
}

export function isDefined<T>(obj: T | null | undefined): obj is NonNullable<T> {
  return obj !== undefined && obj !== null
}

export function flipConstrain(value: number, min: number, max: number): number {
  const range = max - min
  
  return value >= min
    ? value <= max
      ? value
      : value - range
    : range - value
}

export function constrain(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

export function getPercentage(value: number, min: number, max: number): number {
  const percentage = ((value - min) / (max - min)) * 100
  return constrain(percentage, 0, 100)
}
