import { Matrix4 } from "./m4"
import { V3, Vec3 } from "./v3"

export function lookAt(cameraPosition: Vec3, target: Vec3, up: Vec3): Matrix4 {
  const zAxis = V3.normalize(V3.subtract(cameraPosition, target))
  const xAxis = V3.normalize(V3.cross(up, zAxis))
  const yAxis = V3.normalize(V3.cross(zAxis, xAxis))
  
  return [
    xAxis[0], xAxis[1], xAxis[2], 0,
    yAxis[0], yAxis[1], yAxis[2], 0,
    zAxis[0], zAxis[1], zAxis[2], 0,
    cameraPosition[0], cameraPosition[1], cameraPosition[2], 1
  ]
}

export function perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
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

export function orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
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

export function frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {

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
