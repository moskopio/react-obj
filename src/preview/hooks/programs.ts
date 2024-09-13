import { useContext, useEffect, useRef } from "react"
import { getLookAtMatrices } from "src/geometry/camera"
import { getLightPosition } from "src/geometry/light"
import { createGridObject } from "src/preview/objects/grid"
import { createMeshObject } from "src/preview/objects/mesh"
import { createOutlineObject } from "src/preview/objects/outline"
import { createPointsObject } from "src/preview/objects/points"
import { createWireframeObject } from "src/preview/objects/wireframe"
import { createGridProgram } from "src/preview/programs/grid"
import { createMeshProgram } from "src/preview/programs/mesh"
import { createOutlineProgram } from "src/preview/programs/outline"
import { createPointsProgram } from "src/preview/programs/points"
import { createWireframeProgram } from "src/preview/programs/wireframe"
import { AppContext } from "src/state/context"
import { ObjContext } from "src/state/obj"
import { Dict, Object3D, Program } from "src/types"
import { createDepthFrameBuffer, createDepthTexture } from "src/webgl/framebuffer"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: { width: number, height: number }
}

interface Programs {
  mesh?:      Program
  outline?:   Program 
  grid?:      Program
  wireframe?: Program
  points?:    Program
}

interface Objects {
  mesh:      Object3D[]
  outline:   Object3D[]
  grid:      Object3D[]
  wireframe: Object3D[]
  points:    Object3D[]
}

export function usePrograms(props: Props): void {
  const { gl, resolution } = props
  const programsRef = useRef<Programs>({})
  const objectsRef  = useRef<Objects>(createEmptyObjects())
  const texturesRef = useRef<Dict<WebGLTexture | null>>({})
  const frameBufferRef = useRef<WebGLFramebuffer | null>()
  const updateShadowsRef = useRef<boolean>(true)

  const requestId = useRef<number>(-1)
  const { camera, settings, scene } = useContext(AppContext)
  const { obj } = useContext(ObjContext)
  
  useEffect(() => {
    if (gl) {
      const textures = texturesRef.current
      textures.shadowMap = createDepthTexture(gl, 2048)
      frameBufferRef.current = createDepthFrameBuffer(gl, textures.shadowMap!)
      
      const programs = programsRef.current
      programs.grid = createGridProgram(gl)
      programs.outline = createOutlineProgram(gl)
      programs.mesh = createMeshProgram(gl)
      programs.wireframe = createWireframeProgram(gl)
      programs.points = createPointsProgram(gl)
    
      const objects = objectsRef.current
      objects.grid = [...objects.grid, createGridObject()]
    }
  }, [gl])
  
  useEffect(() => {
    const objects = objectsRef.current
    
    objects.mesh = [createMeshObject(obj)]
    objects.wireframe = [createWireframeObject(obj)]
    objects.outline = [createOutlineObject(obj)]
    objects.points = [createPointsObject(obj)]
    
    updateShadowsRef.current = true
  }, [gl, obj])
  
  useEffect(() => {
    const programs = programsRef.current
    const { projection, view, position } = getLookAtMatrices(camera)
    const values = { projection, view, cameraPosition: position }
    Object.values(programs).forEach(p => p?.updateCamera?.(values))
  }, [gl, camera])
  
  useEffect(() => {
    const objects = objectsRef.current
    const programs = programsRef.current
    Object.values(programs).forEach(p => p?.updateSettings?.(settings))
    Object.values(objects).forEach(g => g.forEach((o: Object3D) => o.updateSettings?.(settings)))
  },[gl, settings])
  
  useEffect(() => {
    const programs = programsRef.current
    updateShadowsRef.current = true
    
    Object.values(programs).forEach(p => p?.updateScene?.(scene))
  },[gl, scene])
  
  useEffect(() => {
    const programs = programsRef.current
    Object.values(programs).forEach(p => p?.cleanup())
  }, [])
  
  useEffect(() => {
    draw(Date.now())
    return () => { requestId.current && cancelAnimationFrame(requestId.current) }
  }, [draw])
  
  function draw(time: number): void {
    if (updateShadowsRef.current) {
      drawShadows(time)
      updateShadowsRef.current = false
    }

    const objects = objectsRef.current
    const programs = programsRef.current
    
    objects.grid.forEach(grid => programs.grid?.draw(time, grid))
    objects.outline.forEach(outline => programs.outline?.draw(time, outline))
    objects.mesh.forEach(mesh => programs.mesh?.draw(time, mesh))
    objects.wireframe.forEach(wireframe => programs.wireframe?.draw(time, wireframe))
    objects.points.forEach(points => programs.points?.draw(time, points))

    requestId.current = requestAnimationFrame(draw)
  }
  
  function drawShadows(time: number): void {
    const objects = objectsRef.current
    const programs = programsRef.current
    const framebuffer = frameBufferRef.current
    const textures = texturesRef.current
    
    if (framebuffer) {
      const light = scene.light
      const lightView = getLightPosition(light)
      const lightValues = { 
        projection:     lightView.projection, 
        view:           lightView.view, 
        cameraPosition: lightView.position 
      }
      Object.values(programs).forEach(p => p?.updateCamera?.(lightValues))
      
      gl?.bindFramebuffer(gl.FRAMEBUFFER, frameBufferRef.current!)
      
      gl?.viewport(0, 0, 2048, 2048)
      gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      objects.points.forEach(mesh => programs.mesh?.draw(time, mesh))
      
      // Reset to normal drawing
      gl?.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl?.viewport(0, 0, resolution.width, resolution.height)
      gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      const cameraView = getLookAtMatrices(camera)
      const cameraValues = { 
        projection:      cameraView.projection,
        view:            cameraView.view,
        cameraPosition:  cameraView.position,
        lightProjection: lightView.projection,
        lightView:       lightView.view,
      }
      
      Object.values(programs).forEach(p => p?.updateCamera?.(cameraValues))
      Object.values(programs).forEach(p => p?.updateTextures?.(textures))
    }
  }
}

function createEmptyObjects() {
  return { mesh: [], outline: [], grid: [], wireframe: [], points: [] }
}
