import { Vec3 } from "./math/v3"

export function colorToVec3(color: number): Vec3 {
  const r = (color >> 16) / 255
  const g = (color >> 8 & 0xFF) / 255
  const b = (color & 0xFF) / 255
  return [r, g, b]
}
