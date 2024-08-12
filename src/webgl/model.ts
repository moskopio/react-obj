import { Obj } from "../state/obj"
import { Settings } from "../state/settings"
import { M4, Matrix4 } from "../utils/math/m4"
import { V3 } from "../utils/math/v3"

export function getModelMatrix(obj: Obj, settings: Settings): Matrix4 {
  const { boundingBox } = obj.parsed
  const [min, max] = boundingBox
  
  // Swapping YZ
  const swap = settings.swapYZ 
    ? M4.xRotation(-Math.PI / 2)
    : M4.identity()
    
  const range = V3.subtract(max, min)
  const scaling = 2 / Math.max(...range)
  
  // Translate to center
  const offset = V3.scale(V3.add(min, V3.scale(range, 0.5)), -1)
  const translationCenter = M4.translation(offset)

  // Translate to floor
  const yScaling = 2 / range[1]
  const yOffset = min[1] + range[1] * 0.5 * (yScaling / scaling)
  const translationFloor = M4.translation([0, -yOffset - offset[1], 0])
  

  // Scale to fit
  const scale = M4.scaling([scaling, scaling, scaling])
  
  return M4.combine(swap, scale, translationCenter, translationFloor)

}
