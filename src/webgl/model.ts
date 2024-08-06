import { M4, Matrix4 } from "../math/m4"
import { Obj } from "../state/obj"
import { Settings } from "../state/settings"

export function getModelMatrix(obj: Obj, settings: Settings): Matrix4 {
  
  const model = settings.swapYZ 
    ? M4.xRotation(-Math.PI / 2)
    : M4.identity()
  
  return model
}
