
export interface Dict<T> {
  [key: string]: T | undefined;
}

export function areEqual<T>(a: T, b: T): boolean {
  return a === b
}
