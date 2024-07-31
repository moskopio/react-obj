import { ReactElement, useContext, useEffect, useRef, useState } from "react"
import './WebGLPreview.css'
import { createMeshDrawer, MeshDrawer } from "./mesh-drawer"
import { StateContext } from "../state"


const PREVIEW_WIDTH = 600
const PREVIEW_HEIGHT = 400

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gl, setGL] = useState<WebGLRenderingContext | undefined>(undefined)
  const [meshDrawer, setMeshDrawer] = useState<MeshDrawer | undefined>(undefined)
  
  const {obj, rotation, distance} = useContext(StateContext)
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const gl = canvas.getContext("webgl", {antialias: false, depth: false})
      if (gl) {
        setGL(gl)
        const meshDrawer = createMeshDrawer(gl)
        meshDrawer?.setViewPort(PREVIEW_WIDTH, PREVIEW_HEIGHT)
        setMeshDrawer(meshDrawer)
      }
    }
  }, [])
  
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
  
  return (
    <canvas ref={canvasRef} className="webgl-canvas" width={600} height={400} />
  )
}
