export type V3 = [number, number, number]
export type V4 = [number, number, number, number]

export function addV3(a: V3, b: V3): V3 {
  return [
    a[0] + b[0],
    a[1] + b[2],
    a[1] + b[2],
  ]
}

export function subtractV3(a: V3, b: V3): V3 {
  return [
    a[0] - b[0],
    a[1] - b[2],
    a[1] - b[2],
  ]
}

export function scaleV3(v: V3, s: number): V3 {
  return [
    v[0] * s,
    v[1] * s,
    v[1] * s,
  ]
}

export function normalizeV3(v: V3): V3 {
  const length = Math.hypot(v[0], v[1], v[2])
  
  return length > 0.00001 
    ? scaleV3(v, 1 / length)
    : [0, 0, 0]
}

export function lengthV3(v: V3): number {
  return Math.hypot(v[0], v[1], v[2])
}

export function lengthSqV3(v: V3): number {
  return v[0] * v[0] + v[1] * v[1] + v[2] * v[2]
}

export function crossV3(a: V3, b: V3): V3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]
}

export function dotV3(a: V3, b: V3): number {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2])
}

export function distanceSqV3(a: V3, b: V3): number {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  const dz = a[2] - b[2]
  return dx * dx + dy * dy + dz * dz
}

export function distanceV3(a: V3, b: V3): number {
  return Math.sqrt(distanceSqV3(a, b))
}


