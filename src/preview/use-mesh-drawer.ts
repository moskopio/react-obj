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
  const {obj, rotation, position } = useContext(AppContext)
    
  useEffect(() => {
    if (gl) {
      const meshDrawer = createMeshDrawer(gl)
      setMeshDrawer(meshDrawer)
      meshDrawer?.draw(0)
    }
  }, [gl])
  
  useEffect(() => { 
    meshDrawer?.setObj(obj)
  }, [gl, meshDrawer, obj])
  
  
  useEffect(() => { 
    meshDrawer?.updateCamera(rotation, position)
  }, [gl, meshDrawer, rotation, position])  
}


