export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

function add(a: Vec3, b: Vec3): Vec3 {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
  ]
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ]
}

function scale(v: Vec3, s: number): Vec3 {
  return [
    v[0] * s,
    v[1] * s,
    v[2] * s,
  ]
}

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2])
  
  return length > 0.00001
    ? scale(v, 1 / length)
    : [0, 0, 0]
}

function length(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2])
}

function lengthSq(v: Vec3): number {
  return v[0] * v[0] + v[1] * v[1] + v[2] * v[2]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]
}

function dot(a: Vec3, b: Vec3): number {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2])
}

function distanceSq(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  const dz = a[2] - b[2]
  return dx * dx + dy * dy + dz * dz
}

function distance(a: Vec3, b: Vec3): number {
  return Math.sqrt(distanceSq(a, b))
}

function areEqual(a: Vec3, b: Vec3): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

function limit(v: Vec3, min: number, max: number): Vec3 { 
  return [limitPart(v[0]), limitPart(v[1]), limitPart(v[2])]
  
  function limitPart(v: number): number {
    return v > min
      ? v < max ? v : max
      : min
  }
}

export const V3 = { 
  add, 
  cross, 
  distance,
  dot, 
  length, 
  lengthSq, 
  normalize, 
  scale, 
  subtract, 
  areEqual,
  limit
}
