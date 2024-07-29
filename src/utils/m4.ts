import { crossV3, dotV4, lengthV3, normalizeV3, subtractV3, V3, V4 } from "./v3"

type M4 = number[]


function getColumn(m: M4, c: number): V4 {
  return [ m[c * 4], m[c * 4 + 1], m[c * 4 + 2], m[c * 4 + 3]]
}

function getRow(m: M4, r: number): V4 {
	return [ m[r], m[r + 4], m[r + 8], m[r + 12]]
}

export function multiplyM4(a: M4, b: M4): M4 {
  const r0 = getRow(b, 0)
	const r1 = getRow(b, 1)
	const r2 = getRow(b, 2)
  const r3 = getRow(b, 3)
  
	const c0 = getColumn(a, 0)
	const c1 = getColumn(a, 1)
	const c2 = getColumn(a, 2)
  const c3 = getColumn(a, 2)
  
  return [
    dotV4(r0, c0), dotV4(r1, c0), dotV4(r2, c0), dotV4(r3, c0),
		dotV4(r0, c1), dotV4(r1, c1), dotV4(r2, c1), dotV4(r3, c1),
		dotV4(r0, c2), dotV4(r1, c2), dotV4(r2, c2), dotV4(r3, c2),
    dotV4(r0, c2), dotV4(r1, c2), dotV4(r2, c2), dotV4(r3, c3),
  ]
}

export function identityM4(): M4 {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
}

export function transposeM4(m: M4): M4 {
  
  return [
    m[0], m[4],  m[8], m[12],
    m[1], m[5],  m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15],
  ]
}

export function copy(src: M4): M4 {
  return [...src]
}


export function lookAt(cameraPosition: V3, target: V3, up: V3): M4 {
  const zAxis = normalizeV3(subtractV3(cameraPosition, target))
  const xAxis = normalizeV3(crossV3(up, zAxis))
  const yAxis = normalizeV3(crossV3(zAxis, xAxis))
  
  return [
    xAxis[0], xAxis[1], xAxis[2], 0,
    yAxis[0], yAxis[1], yAxis[2], 0,
    zAxis[0], zAxis[1], zAxis[2], 0,
    cameraPosition[0], cameraPosition[1], cameraPosition[2], 1
  ]
}

export function perspective(fov: number, aspect: number, near: number, far: number): M4 {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
  const rangeInv = 1.0 / (near - far)
  
  const d = (near + far) * rangeInv
  
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, d, -1,
    0, 0, d * 2, 0,
  ]
}

export function orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): M4 {
  const x = 2 / (right - left)
  const y = 2 / (top - bottom)
  const z = 2 / (near - far)
  
  const t0 = (near + far) / (near - far)
  const t1 = (bottom + top) / (bottom - top)
  const t2 = (near + far) / (near - far)
  
  return [
    x,  0,  0, 0,
    0,  y,  0, 0,
    0,  0,  z, 0,
    t0, t1, t2, 0,
  ]
}

export function frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): M4 {

    const dx = right - left
    const dy = top - bottom
    const dz = far - near
    
    const x = 2 * near / dx
    const y = 2 * near / dy
    const z0 = (left + right) / dx
    const z1 = (top + bottom) / dy
    const z2 = -(far + near) / dz
    const tz = -2 * near * far / dz
    
    return [
       x,  0,  0,  0,
       0,  y,  0,  0,
      z0, z1, z2, -1,
       0,  0, tz,  0,
    ]
  }

  export function translation(tx: number, ty: number, tz: number): M4 {
    return [
       1,  0,  0, 0,
       0,  1,  0, 0,
       0,  0,  1, 0,
      tx, ty, tz, 1
    ]
  }

export function translate(m: M4, tx: number, ty: number, tz: number): M4 {
  const translationM4 = translation(tx, ty, tz)
  return multiplyM4(m, translationM4)
}

export function xRotation(angle: number): M4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  
  return [
    1,  0,  0, 0,
    0,  c,  s, 0,
    0, -s,  c, 0,
    0,  0,  0, 1
 ]
}

export function xRotate(m: M4, angle: number) {
  const xRotationM4 = xRotation(angle)
  return multiplyM4(m, xRotationM4)
}

export function yRotation(angle: number): M4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  
  return [
    c,  0, -s, 0,
    0,  1,  0, 0,
    s,  0,  c, 0,
    0,  0,  0, 1
  ]
}

export function yRotate(m: M4, angle: number): M4 {
  const yRotationM4 = yRotation(angle)
  return multiplyM4(m, yRotationM4)
}

export function zRotation(angle: number): M4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  
  return [
      c, s, 0, 0,
    -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
  ]
}

export function zRotate(m: M4, angle: number): M4 {
  const zRotationM4 = zRotation(angle)
  return multiplyM4(m, zRotationM4)
}

export function axisRotation(axis: V3, angle: number): M4 {
  const n = lengthV3(axis)
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

export function axisRotate(m: M4, axis: V3, angle: number): M4 {
  const axisRotationM4 = axisRotation(axis, angle)
  return multiplyM4(m, axisRotationM4)
}


function scaling(sx: number, sy: number, sz: number): M4 {
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1
  ]
}

export function scale(m: M4, sx: number, sy: number, sz: number): M4 {
  const scalingM4 = scaling(sx, sy, sz)
  return multiplyM4(m, scalingM4)
}

  
  // TODO: refactor - could be composed from multiple M4!
export function compose(translation: V3, quaternion: V4, scale: V3): M4 {
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

function quatFromRotationMatrix(m: M4): V4 {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  
  const dst: V4 = [0, 0, 0, 0]

  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
  const m11 = m[0]
  const m12 = m[4]
  const m13 = m[8]
  const m21 = m[1]
  const m22 = m[5]
  const m23 = m[9]
  const m31 = m[2]
  const m32 = m[6]
  const m33 = m[10]

  const trace = m11 + m22 + m33

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1)
    dst[3] = 0.25 / s
    dst[0] = (m32 - m23) * s
    dst[1] = (m13 - m31) * s
    dst[2] = (m21 - m12) * s
  } else if (m11 > m22 && m11 > m33) {
    const s = 2 * Math.sqrt(1 + m11 - m22 - m33)
    dst[3] = (m32 - m23) / s
    dst[0] = 0.25 * s
    dst[1] = (m12 + m21) / s
    dst[2] = (m13 + m31) / s
  } else if (m22 > m33) {
    const s = 2 * Math.sqrt(1 + m22 - m11 - m33)
    dst[3] = (m13 - m31) / s
    dst[0] = (m12 + m21) / s
    dst[1] = 0.25 * s
    dst[2] = (m23 + m32) / s
  } else {
    const s = 2 * Math.sqrt(1 + m33 - m11 - m22)
    dst[3] = (m21 - m12) / s
    dst[0] = (m13 + m31) / s
    dst[1] = (m23 + m32) / s
    dst[2] = 0.25 * s
  }
  
  return dst
}

// TODO: refactor

interface Decomposition {
  quaternion:  V4
  scale:       V3
  translation: V3
}

export function decompose(m: M4 ): Decomposition {
  let sx = lengthV3(m.slice(0, 3) as V3)
  const sy = lengthV3(m.slice(4, 7) as V3)
  const sz = lengthV3(m.slice(8, 11) as V3)

  // if determinate is negative, we need to invert one scale
  const det = determinate(m)
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
  const scale = [sx, sy, sz] as V3
  const translation = [m[12], m[13], m[14]] as V3
  
  return { quaternion, scale, translation }
}

// TODO: refactor
function determinate(m: M4): number {
  const m00 = m[0 * 4 + 0]
  const m01 = m[0 * 4 + 1]
  const m02 = m[0 * 4 + 2]
  const m03 = m[0 * 4 + 3]
  const m10 = m[1 * 4 + 0]
  const m11 = m[1 * 4 + 1]
  const m12 = m[1 * 4 + 2]
  const m13 = m[1 * 4 + 3]
  const m20 = m[2 * 4 + 0]
  const m21 = m[2 * 4 + 1]
  const m22 = m[2 * 4 + 2]
  const m23 = m[2 * 4 + 3]
  const m30 = m[3 * 4 + 0]
  const m31 = m[3 * 4 + 1]
  const m32 = m[3 * 4 + 2]
  const m33 = m[3 * 4 + 3]
  const tmp_0  = m22 * m33
  const tmp_1  = m32 * m23
  const tmp_2  = m12 * m33
  const tmp_3  = m32 * m13
  const tmp_4  = m12 * m23
  const tmp_5  = m22 * m13
  const tmp_6  = m02 * m33
  const tmp_7  = m32 * m03
  const tmp_8  = m02 * m23
  const tmp_9  = m22 * m03
  const tmp_10 = m02 * m13
  const tmp_11 = m12 * m03

  const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
  const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
  const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
  const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

  return 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)
}

// TODO: broken!
export function inverse(m: M4): M4 {
  const m00 = m[0 * 4 + 0]
  const m01 = m[0 * 4 + 1]
  const m02 = m[0 * 4 + 2]
  const m03 = m[0 * 4 + 3]
  const m10 = m[1 * 4 + 0]
  const m11 = m[1 * 4 + 1]
  const m12 = m[1 * 4 + 2]
  const m13 = m[1 * 4 + 3]
  const m20 = m[2 * 4 + 0]
  const m21 = m[2 * 4 + 1]
  const m22 = m[2 * 4 + 2]
  const m23 = m[2 * 4 + 3]
  const m30 = m[3 * 4 + 0]
  const m31 = m[3 * 4 + 1]
  const m32 = m[3 * 4 + 2]
  const m33 = m[3 * 4 + 3]
  const tmp_0  = m22 * m33
  const tmp_1  = m32 * m23
  const tmp_2  = m12 * m33
  const tmp_3  = m32 * m13
  const tmp_4  = m12 * m23
  const tmp_5  = m22 * m13
  const tmp_6  = m02 * m33
  const tmp_7  = m32 * m03
  const tmp_8  = m02 * m23
  const tmp_9  = m22 * m03
  const tmp_10 = m02 * m13
  const tmp_11 = m12 * m03
  const tmp_12 = m20 * m31
  const tmp_13 = m30 * m21
  const tmp_14 = m10 * m31
  const tmp_15 = m30 * m11
  const tmp_16 = m10 * m21
  const tmp_17 = m20 * m11
  const tmp_18 = m00 * m31
  const tmp_19 = m30 * m01
  const tmp_20 = m00 * m21
  const tmp_21 = m20 * m01
  const tmp_22 = m00 * m11
  const tmp_23 = m10 * m01
  
  const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
  const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
  const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
  const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

  const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)
  
  const dst = []
  dst[0] = d * t0
  dst[1] = d * t1
  dst[2] = d * t2
  dst[3] = d * t3
  dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30))
  dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30))
  dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30))
  dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20))
  dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33))
  dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33))
  dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33))
  dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23))
  dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22))
  dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02))
  dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12))
  dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))

  return dst
}

export function transformVector(m: M4, v: V4): V4 {
  const dst = []
  for (let i = 0; i < 4; ++i) {
    dst[i] = 0.0
    for (let j = 0; j < 4; ++j) {
      dst[i] += v[j] * m[j * 4 + i]
    }
  }
  return dst as V4
}

// TODO: refactor
export function transformPoint(m: M4, v: V3): V4 {
  const dst = []
  const v0 = v[0]
  const v1 = v[1]
  const v2 = v[2]
  const d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3]

  dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d
  dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d
  dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d

  return dst as V4
}


// TODO: refactor
export function transformDirection(m: M4, v: V3): V4 {
  const dst = []

  const v0 = v[0]
  const v1 = v[1]
  const v2 = v[2]

  dst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0]
  dst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1]
  dst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2]

  return dst as V4
}

// TODO: refactor
export function transformNormal(m: M4, v: V3): V3 {
  const dst = [] 
  const mi = inverse(m)
  const v0 = v[0]
  const v1 = v[1]
  const v2 = v[2]

  dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2]
  dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2]
  dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2]

  return dst as V3
}
