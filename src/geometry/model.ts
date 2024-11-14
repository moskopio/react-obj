import { M4, Matrix4 } from "src/math/m4"
import { V3, Vec3 } from "src/math/v3"
import { Settings } from "src/state/settings"

type BoundingBox = [min: Vec3, max: Vec3]

export function getModelMatrix(boundingBox: BoundingBox, settings: Settings): Matrix4 {
  const [min, max] = boundingBox
  
  // Swapping YZ
  const swap = settings.swapYZ
    ? M4.xRotation(-Math.PI / 2)
    : M4.identity()
    
  const range = V3.subtract(max, min)
  const maxRange = Math.max(...range) || 1
  const scaling = 2 / maxRange

  // Translate to center
  const offset = V3.scale(V3.add(min, V3.scale(range, 0.5)), -1)
  const translationCenter = M4.translation(offset)

  // Translate to floor
  const yScaling = 2 / ( range[1] || 1)
  const yOffset = min[1] + range[1] * 0.5 * (yScaling / scaling)
  const translationFloor = M4.translation([0, -yOffset - offset[1], 0])
  
  // Scale to fit
  const scale = M4.scaling([scaling, scaling, scaling])
  
  return M4.combine(swap, scale, translationCenter, translationFloor)
}
