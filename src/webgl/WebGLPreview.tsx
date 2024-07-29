import { ReactElement, useContext, useEffect, useRef, useState } from "react"
import './WebGLPreview.css'
import { createMeshDrawer, MeshDrawer } from "./mesh-drawer"
import { StateContext } from "../state"

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gl, setGL] = useState<WebGLRenderingContext | undefined>(undefined)
  const [meshDrawer, setMeshDrawer] = useState<MeshDrawer | undefined>(undefined)
  
  const {obj} = useContext(StateContext)
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const gl = canvas.getContext("webgl", {antialias: false, depth: false})
      if (gl) {
        setGL(gl)
        gl?.viewport( 0, 0, 600, 400)
        const meshDrawer = createMeshDrawer(gl)
        meshDrawer?.setView()
        setMeshDrawer(meshDrawer)
      }
    }
  }, [])
  
  useEffect(() => { 
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    meshDrawer?.setObj(obj)
    meshDrawer?.draw()
  }, [gl, meshDrawer, obj])
  
  return (
    <canvas ref={canvasRef} className="webgl-canvas" width={600} height={400} />
  )
}
