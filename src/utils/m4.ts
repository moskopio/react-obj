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
  transformVector,
  transformPoint,
  transformDirection,
  transformNormal
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

function translation(tx: number, ty: number, tz: number): Matrix4 {
  return [
      1,  0,  0, 0,
      0,  1,  0, 0,
      0,  0,  1, 0,
     tx, ty, tz, 1
  ]
}

function translate(m: Matrix4, tx: number, ty: number, tz: number): Matrix4 {
  const translationM4 = translation(tx, ty, tz)
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

function scaling(sx: number, sy: number, sz: number): Matrix4 {
  return [
    sx,  0,  0, 0,
     0, sy,  0, 0,
     0,  0, sz, 0,
     0,  0,  0, 1
  ]
}

function scale(m: Matrix4, sx: number, sy: number, sz: number): Matrix4 {
  const scalingM4 = scaling(sx, sy, sz)
  return multiply(scalingM4, m)
}

// TODO: refactor - could be composed from multiple M4!
function compose(translation: Vec3, quaternion: Vec4, scale: Vec3): Matrix4 {
  const x = quaternion[0]
  const y = quaternion[1]
  const z = quaternion[2]
  const w = quaternion[3]

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

  const sx = scale[0]
  const sy = scale[1]
  const sz = scale[2]
  
  return [
    ((1 - (yy + zz)) * sx), ((xy + wz) * sx), ((xz - wy) * sx), 0,
    ((xy - wz) * sy), ((1 - (xx + zz)) * sy), ((xz - wy) * sx), 0,
    ((xz + wy) * sz), ((yz - wx) * sz), ((1 - (xx + yy)) * sz), 0,
    translation[0], translation[1], translation[2], 1
  ]
}


interface Decomposition {
  quaternion:  Vec4
  scale:       Vec3
  translation: Vec3
}

function decompose(m: Matrix4): Decomposition {
  let sx = V3.length(m.slice(0, 3) as Vec3)
  const sy = V3.length(m.slice(4, 7) as Vec3)
  const sz = V3.length(m.slice(8, 11) as Vec3)

  // if determinate is negative, we need to invert one scale
  const det = determinateM4(m)
  if (det < 0) {
    sx = -sx
  }

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

function inverse(m: Matrix4): Matrix4 {
  const dst = []
  const det = determinate(m)

  if (det > 0.00001) {
    const d = 1 / det
    dst[0] = d * M3.inverseSum(getSubMatrix(m, 0, 0))
    dst[1] = -d * M3.inverseSum(getSubMatrix(m, 1, 0))
    dst[2] = d * M3.inverseSum(getSubMatrix(m, 2, 0))
    dst[3] = -d * M3.inverseSum(getSubMatrix(m, 3, 0))
    
    dst[4] = -d * M3.inverseSum(getSubMatrix(m, 0, 1))
    dst[5] = d * M3.inverseSum(getSubMatrix(m, 1, 1))
    dst[6] = -d * M3.inverseSum(getSubMatrix(m, 2, 1))
    dst[7] = d * M3.inverseSum(getSubMatrix(m, 3, 1))
    
    dst[8] = d * M3.inverseSum(getSubMatrix(m, 0, 2))
    dst[9] = -d * M3.inverseSum(getSubMatrix(m, 1, 2))
    dst[10] = d * M3.inverseSum(getSubMatrix(m, 2, 2))
    dst[11] = -d * M3.inverseSum(getSubMatrix(m, 3, 2))
    
    dst[12] = -d * M3.inverseSum(getSubMatrix(m, 0, 3))
    dst[13] = d * M3.inverseSum(getSubMatrix(m, 1, 3))
    dst[14] = -d * M3.inverseSum(getSubMatrix(m, 2, 3))
    dst[15] = d * M3.inverseSum(getSubMatrix(m, 3, 3))
  
    return transpose(dst)
  } else {
    return empty()
  }
}

function transformVector(m: Matrix4, v: Vec4): Vec4 {
  const dst = []
  for (let i = 0; i < 4; ++i) {
    dst[i] = 0.0
    for (let j = 0; j < 4; ++j) {
      dst[i] += v[j] * m[j * 4 + i]
    }
  }
  return dst as Vec4
}

// TODO: refactor
function transformPoint(m: Matrix4, v: Vec3): Vec4 {
  const dst = []
  const v0 = v[0]
  const v1 = v[1]
  const v2 = v[2]
  const d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3]

  dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d
  dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d
  dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d

  return dst as Vec4
}


// TODO: refactor
function transformDirection(m: Matrix4, v: Vec3): Vec4 {
  const dst = []

  const v0 = v[0]
  const v1 = v[1]
  const v2 = v[2]

  dst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0]
  dst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1]
  dst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2]

  return dst as Vec4
}

// TODO: refactor
function transformNormal(m: Matrix4, v: Vec3): Vec3 {
  const dst = [] 
  const mi = inverse(m)
  const v0 = v[0]
  const v1 = v[1]
  const v2 = v[2]

  dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2]
  dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2]
  dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2]

  return dst as Vec3
}
