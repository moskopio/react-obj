import { useContext, useEffect, useState } from "react"
import { AppContext } from "../state"
import { createMeshDrawer, MeshDrawer } from "./mesh-drawer"

interface Props {
  gl:     WebGLRenderingContext | null
  width:  number
  height: number
}

export function useMeshDrawer(props: Props): void {
  const { gl, width, height } = props
  
  const [meshDrawer, setMeshDrawer] = useState<MeshDrawer | undefined>(undefined)
  const {obj, rotation, distance } = useContext(AppContext)
    
  useEffect(() => {
    if (gl) {
      const meshDrawer = createMeshDrawer(gl)
      meshDrawer?.setViewPort(width, height)
      setMeshDrawer(meshDrawer)
    }
  }, [gl])
  
  useEffect(() => { 
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    meshDrawer?.setObj(obj)
    meshDrawer?.draw()
  }, [gl, meshDrawer, obj])
  
  
  useEffect(() => { 
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    meshDrawer?.updateCamera(rotation, distance)
    meshDrawer?.draw()
  }, [gl, meshDrawer, rotation, distance])
}


