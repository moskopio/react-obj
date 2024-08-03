import { useContext, useEffect, useState } from "react"
import { AppContext } from "../state"
import { createMeshDrawer, MeshDrawer } from "./mesh-drawer"

interface Props {
  gl:     WebGLRenderingContext | null
  width:  number
  height: number
}

export function useMeshDrawer(props: Props): void {
  const { gl } = props
  
  const [meshDrawer, setMeshDrawer] = useState<MeshDrawer | undefined>(undefined)
  const {obj, rotation, position, settings } = useContext(AppContext)
    
  useEffect(() => {
    if (gl) {
      const meshDrawer = createMeshDrawer(gl)
      setMeshDrawer(meshDrawer)
      meshDrawer?.draw()
    }
  }, [gl])
  
  useEffect(() => { 
    
    meshDrawer?.setObj(obj)
    // meshDrawer?.draw()
  }, [gl, meshDrawer, obj])
  
  
  useEffect(() => { 
    meshDrawer?.updateCamera(rotation, position)
  }, [gl, meshDrawer, rotation, position])
  
  useEffect(() => { 
    meshDrawer?.updateSettings(settings)
    // meshDrawer?.draw()
  }, [gl, meshDrawer, settings])
  
}


