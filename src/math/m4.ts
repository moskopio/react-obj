import { M3, Matrix3 } from "./m3"
import { Vec3, V3 } from "./v3"
import { Vec4, V4 } from "./v4"

export type Matrix4 = number[]

export const M4 = {
  multiply,
  multiplyBy,
  identity,
  empty,
  transpose,
  translation,
  translate,
  xRotation,
  xRotate,
  yRotation,
  yRotate,
  zRotation,
  zRotate,
  axisRotation,
  axisRotate,
  scaling,
  scale,
  compose,
  decompose,
  getSubMatrix,
  determinate,
  inverse,
}

function getColumn(m: Matrix4, c: number): Vec4 {
  return [ m[c * 4], m[c * 4 + 1], m[c * 4 + 2], m[c * 4 + 3]]
}

function getRow(m: Matrix4, r: number): Vec4 {
	return [ m[r], m[r + 4], m[r + 8], m[r + 12]]
}

function multiply(a: Matrix4, b: Matrix4): Matrix4 {
  const r0 = getRow(b, 0)
	const r1 = getRow(b, 1)
	const r2 = getRow(b, 2)
  const r3 = getRow(b, 3)
  
	const c0 = getColumn(a, 0)
	const c1 = getColumn(a, 1)
	const c2 = getColumn(a, 2)
  const c3 = getColumn(a, 3)
  
  return [
    V4.dot(r0, c0), V4.dot(r1, c0), V4.dot(r2, c0), V4.dot(r3, c0),
		V4.dot(r0, c1), V4.dot(r1, c1), V4.dot(r2, c1), V4.dot(r3, c1),
		V4.dot(r0, c2), V4.dot(r1, c2), V4.dot(r2, c2), V4.dot(r3, c2),
    V4.dot(r0, c3), V4.dot(r1, c3), V4.dot(r2, c3), V4.dot(r3, c3),
  ]
}

function multiplyBy(m: Matrix4, n: number): Matrix4 {
  return [
     m[0] * n,  m[1] * n,  m[2] * n,  m[3] * n, 
     m[4] * n,  m[5] * n,  m[6] * n,  m[7] * n, 
     m[8] * n,  m[9] * n, m[10] * n, m[11] * n, 
    m[12] * n, m[13] * n, m[14] * n, m[15] * n, 
  ]
}

function identity(): Matrix4 {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
}

function empty(): Matrix4 {
  return [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ]
}

function transpose(m: Matrix4): Matrix4 {
  return [
    m[0], m[4],  m[8], m[12],
    m[1], m[5],  m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15],
  ]
}

function translation(t: Vec3): Matrix4 {
  const [tx, ty, tz] = t
  return [
      1,  0,  0, 0,
      0,  1,  0, 0,
      0,  0,  1, 0,
     tx, ty, tz, 1
  ]
}

function translate(m: Matrix4, t: Vec3): Matrix4 {
  const translationM4 = translation(t)
  return multiply(translationM4, m)
}

function xRotation(angle: number): Matrix4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  
  return [
    1,  0,  0, 0,
    0,  c,  s, 0,
    0, -s,  c, 0,
    0,  0,  0, 1
 ]
}

function xRotate(m: Matrix4, angle: number) {
  const xRotationM4 = xRotation(angle)
  return multiply(xRotationM4, m)
}

function yRotation(angle: number): Matrix4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  
  return [
    c,  0, -s, 0,
    0,  1,  0, 0,
    s,  0,  c, 0,
    0,  0,  0, 1
  ]
}

function yRotate(m: Matrix4, angle: number): Matrix4 {
  const yRotationM4 = yRotation(angle)
  return multiply(yRotationM4, m)
}

function zRotation(angle: number): Matrix4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  
  return [
      c, s, 0, 0,
     -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
  ]
}

function zRotate(m: Matrix4, angle: number): Matrix4 {
  const zRotationM4 = zRotation(angle)
  return multiply(zRotationM4, m)
}

function axisRotation(axis: Vec3, angle: number): Matrix4 {
  const n = V3.length(axis)
  const x = axis[0] / n
  const y = axis[1] / n
  const z = axis[2] / n
  const x2 = x * x
  const y2 = y * y
  const z2 = z * z
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const mc = 1 - c
  
  return [
  (x2 + c - x2 * c), (x * y * mc + z * s), (x * z * mc - y * s), 0,
  (x * y * mc - z * s), (y2 + c - y2 * c), (y * z * mc + x * s), 0,
  (x * z * mc + y * s), (y * z * mc - x * s), (z2 + c - z2 * c), 0,
  0, 0, 0, 1
  ]
}

function axisRotate(m: Matrix4, axis: Vec3, angle: number): Matrix4 {
  const axisRotationM4 = axisRotation(axis, angle)
  return multiply(axisRotationM4, m)
}

function scaling(s: Vec3): Matrix4 {
  const [sx, sy, sz] = s
  return [
    sx,  0,  0, 0,
     0, sy,  0, 0,
     0,  0, sz, 0,
     0,  0,  0, 1
  ]
}

function scale(m: Matrix4, s: Vec3): Matrix4 {
  const scalingM4 = scaling(s)
  return multiply(scalingM4, m)
}

// TODO: refactor - could be composed from multiple M4!
function compose(translation: Vec3, quaternion: Vec4, scale: Vec3): Matrix4 {
  const [x, y, z, w] = quaternion
  const [tx, ty, tz] = translation
  const [sx, sy, sz] = scale

  const x2 = x + x
  const y2 = y + y
  const z2 = z + z

  const xx = x * x2
  const xy = x * y2
  const xz = x * z2

  const yy = y * y2
  const yz = y * z2
  const zz = z * z2

  const wx = w * x2
  const wy = w * y2
  const wz = w * z2

  
  return [
    ((1 - (yy + zz)) * sx), ((xy + wz) * sx), ((xz - wy) * sx), 0,
    ((xy - wz) * sy), ((1 - (xx + zz)) * sy), ((xz - wy) * sx), 0,
    ((xz + wy) * sz), ((yz - wx) * sz), ((1 - (xx + yy)) * sz), 0,
    tx, ty, tz, 1
  ]
}


interface Decomposition {
  quaternion:  Vec4
  scale:       Vec3
  translation: Vec3
}

function decompose(m: Matrix4): Decomposition {
  const det = determinate(m)
  
  // if determinate is negative, we need to invert one scale
  const sx = V3.length(m.slice(0, 3) as Vec3) * (det < 0 ? -1 : 1)
  const sy = V3.length(m.slice(4, 7) as Vec3)
  const sz = V3.length(m.slice(8, 11) as Vec3)

  // scale the rotation part
  const matrix = [...m]

  const invSX = 1 / sx
  const invSY = 1 / sy
  const invSZ = 1 / sz

  matrix[0] *= invSX
  matrix[1] *= invSX
  matrix[2] *= invSX

  matrix[4] *= invSY
  matrix[5] *= invSY
  matrix[6] *= invSY

  matrix[8] *= invSZ
  matrix[9] *= invSZ
  matrix[10] *= invSZ

  const quaternion = quatFromRotationMatrix(matrix)
  const scale = [sx, sy, sz] as Vec3
  const translation = [m[12], m[13], m[14]] as Vec3
  
  return { quaternion, scale, translation }
}

function getSubMatrix(m: Matrix4, i: number, j: number): Matrix3 {
  const skipList = [j * 4, j * 4 + 1, j *4 + 2, j * 4 + 3, i, i + 4, i + 8, i + 12]
  return m.filter((_, i) => !skipList.includes(i))
}

function determinate(m: Matrix4): number {
  const part0 = m[0] * M3.determinate(getSubMatrix(m, 0, 0))
  const part1 = m[1] * M3.determinate(getSubMatrix(m, 1, 0))
  const part2 = m[2] * M3.determinate(getSubMatrix(m, 2, 0))
  const part3 = m[3] * M3.determinate(getSubMatrix(m, 3, 0))

  return part0 - part1 + part2 - part3;
}

// TODO: refactor
function quatFromRotationMatrix(m: Matrix4): Vec4 {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  
  const q: Vec4 = [0, 0, 0, 0]

  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
  const rm = [
    m[0], m[4], m[8],
    m[1], m[5], m[9],
    m[2], m[6], m[10]
  ]
  
  const trace = rm[0] + rm[5] + rm[10]

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1)
    q[3] = 0.25 / s
    q[0] = (rm[6] - rm[9]) * s
    q[1] = (rm[8] - rm[2]) * s
    q[2] = (rm[1] - rm[4]) * s
  } else if (rm[0] > rm[5] && rm[0] > rm[10]) {
    const s = 2 * Math.sqrt(1 + rm[0] - rm[5] - rm[10])
    q[3] = (rm[6] - rm[9]) / s
    q[0] = 0.25 * s
    q[1] = (rm[4] + rm[1]) / s
    q[2] = (rm[8] + rm[2]) / s
  } else if (rm[5] > rm[10]) {
    const s = 2 * Math.sqrt(1 + rm[5] - rm[0] - rm[10])
    q[3] = (rm[8] - rm[2]) / s
    q[0] = (rm[4] + rm[1]) / s
    q[1] = 0.25 * s
    q[2] = (rm[9] + rm[6]) / s
  } else {
    const s = 2 * Math.sqrt(1 + rm[10] - rm[0] - rm[5])
    q[3] = (rm[1] - rm[4]) / s
    q[0] = (rm[8] + rm[2]) / s
    q[1] = (rm[9] + rm[6]) / s
    q[2] = 0.25 * s;
  }
  
  return q
}


function inverse(m: Matrix4): Matrix4 {
  const inv = []
  const det = determinate(m)

  if (det > 0.00001) {
    const d = 1 / det
    inv[0] = d * M3.inverseSum(getSubMatrix(m, 0, 0))
    inv[1] = -d * M3.inverseSum(getSubMatrix(m, 1, 0))
    inv[2] = d * M3.inverseSum(getSubMatrix(m, 2, 0))
    inv[3] = -d * M3.inverseSum(getSubMatrix(m, 3, 0))
    
    inv[4] = -d * M3.inverseSum(getSubMatrix(m, 0, 1))
    inv[5] = d * M3.inverseSum(getSubMatrix(m, 1, 1))
    inv[6] = -d * M3.inverseSum(getSubMatrix(m, 2, 1))
    inv[7] = d * M3.inverseSum(getSubMatrix(m, 3, 1))
    
    inv[8] = d * M3.inverseSum(getSubMatrix(m, 0, 2))
    inv[9] = -d * M3.inverseSum(getSubMatrix(m, 1, 2))
    inv[10] = d * M3.inverseSum(getSubMatrix(m, 2, 2))
    inv[11] = -d * M3.inverseSum(getSubMatrix(m, 3, 2))
    
    inv[12] = -d * M3.inverseSum(getSubMatrix(m, 0, 3))
    inv[13] = d * M3.inverseSum(getSubMatrix(m, 1, 3))
    inv[14] = -d * M3.inverseSum(getSubMatrix(m, 2, 3))
    inv[15] = d * M3.inverseSum(getSubMatrix(m, 3, 3))
  
    return transpose(inv)
  } else {
    return empty()
  }
}
