export type vec3 = [number, number, number]
export type vec2 = [number, number] 


export function sub(a: vec3, b: vec3): vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function cross(a: vec3, b: vec3): vec3 {
  const x = a[1] * b[2] - a[2] * b[1]
  const y = a[2] * b[0] - a[0] * b[2]
  const z = a[0] * b[1] - a[1] * b[0]
  return [x, y, z]
}

export function magnitude(a: vec3): number {
  return Math.hypot(...a) 
}

export function normalize(a: vec3): vec3 {
  const mag = magnitude(a)
  return mag ? [a[0] / mag, a[1] /mag, a[2] / mag] : [0, 0, 0]
}
