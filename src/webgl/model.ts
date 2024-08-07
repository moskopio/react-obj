import { M4, Matrix4 } from "../math/m4"
import { V3 } from "../math/v3"
import { Obj } from "../state/obj"
import { Settings } from "../state/settings"

export function getModelMatrix(obj: Obj, settings: Settings): Matrix4 {
  const { boundingBox } = obj.parsed
  const [min, max] = boundingBox
  
  // Swapping YZ
  const swap = settings.swapYZ 
    ? M4.xRotation(-Math.PI / 2)
    : M4.identity()
    
  // Translate to center
  const range = V3.subtract(max, min)
  const offset = V3.scale(V3.add(min, V3.scale(range, 0.5)), -1)
  const translation = M4.translation(offset)
  
  // Scale to fit
  const scaling = 2 / Math.max(...range)
  const scale = M4.scaling([scaling, scaling, scaling])
  
  return M4.combine(swap, scale, translation)
}
