import { Matrix4 } from "./m4"

export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export const V3 = { 
  add,
  cross,
  distance,
  dot, 
  length,
  multiply,
  normalize,
  scale,
  subtract,
  areEqual
}

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
  const vectorLength = length(v)
  
  return vectorLength > 0
    ? scale(v, 1 / vectorLength)
    : [0, 0, 0]
}

function length(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2])
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

function multiply(v: Vec3, m: Matrix4): Vec3 {
  const x = m[0] * v[0] + m[4] * v[1] +  m[8] * v[2] + m[12]
  const y = m[1] * v[0] + m[5] * v[1] +  m[9] * v[2] + m[13]
  const z = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14]

  return [x, y, z]
}

function areEqual(a: Vec3, b: Vec3): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

