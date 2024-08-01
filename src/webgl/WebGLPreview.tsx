import { MouseEvent, ReactElement, useCallback, useContext, useEffect, useRef, useState, WheelEvent } from "react"
import './WebGLPreview.css'
import { createMeshDrawer, MeshDrawer } from "./mesh-drawer"
import { StateContext } from "../state"


const PREVIEW_WIDTH = 600
const PREVIEW_HEIGHT = 400

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gl, setGL] = useState<WebGLRenderingContext | undefined>(undefined)
  const [meshDrawer, setMeshDrawer] = useState<MeshDrawer | undefined>(undefined)
  
  const [isDragged, setIsDragged] = useState(false)
  const [position, setPosition] = useState([0, 0])
  
  const {obj, rotation, distance, setDistance, setRotation } = useContext(StateContext)
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const gl = canvas.getContext("webgl", {antialias: false, depth: true })
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
  
  const handleDragStart = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    setPosition([Math.round(event.clientX), Math.round(event.clientY)])
    setIsDragged(true)
  
  }, [setIsDragged])
  const handleDragEnd = useCallback(() => setIsDragged(false), [setIsDragged])
  const handleDrag = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    if (isDragged) {
      const mouseX = Math.round(event.clientX)
      const mouseY = Math.round(event.clientY)
      const xRotation = rotation[0] - (mouseY - position[1]) / 2
      const yRotation = rotation[1] - (mouseX - position[0]) / 2
          
      setPosition([mouseX, mouseY])
      setRotation([limit(xRotation), limit(yRotation), rotation[2]])
    }
  }, [isDragged, position, rotation])
  
  const handleWheel = useCallback((event: WheelEvent<HTMLCanvasElement>) => {
    const newDistance = distance + (event.deltaY > 0 ? 0.5 : -0.5)
    setDistance(newDistance < 0 ? 0: newDistance > 100 ? 100: newDistance)
  }, [setDistance, distance])
  
  return (
    <canvas 
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      onWheel={handleWheel}
      onMouseLeave={handleDragEnd} 
      ref={canvasRef} 
      className="webgl-canvas" 
      width={PREVIEW_WIDTH} 
      height={PREVIEW_HEIGHT} 
    />
  )
  
  function limit(rotation: number): number {
    return rotation < 0 
      ? 360 - rotation
      : rotation > 360 
        ? rotation - 360 
        : rotation
  }
}
