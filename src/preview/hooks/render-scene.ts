import { useContext, useEffect, useRef } from "react"
import { getLookAtMatrices } from "src/geometry/camera"
import { getLightPosition } from "src/geometry/light"
import { useDrawObjects } from "src/preview/hooks/draw-objects"
import { useDrawShadows } from "src/preview/hooks/draw-shadows"
import { useObjects } from "src/preview/hooks/objects"
import { usePrograms } from "src/preview/hooks/programs"
import { AppContext } from "src/state/context"
import { ObjContext } from "src/state/obj"
import { Object3D } from "src/types"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: { width: number, height: number }
}

export function useRenderScene(props: Props): void {
  const { gl, resolution } = props
  const updateShadowsRef = useRef<boolean>(true)

  const { settings, scene, camera } = useContext(AppContext)
  const { obj} = useContext(ObjContext)
  const requestId = useRef<number>(-1)
  
  const programs = usePrograms(props)
  const objects = useObjects(props)
  const drawShadows = useDrawShadows({gl, programs, objects})
  const drawObjects = useDrawObjects({ gl, programs, objects, resolution })
  
  useEffect(() => {
    Object.values(programs).forEach(p => p?.updateSettings?.(settings))
    Object.values(objects).forEach(g => g.forEach((o: Object3D) => o.updateSettings?.(settings)))
  },[gl, settings])
  
  useEffect(() => {
    updateShadowsRef.current = true
    const { projection, view } = getLightPosition(scene.light)
    const lightValues = { lightProjection: projection, lightView: view }
    Object.values(programs).forEach(p => p?.updateViews?.(lightValues))
    Object.values(programs).forEach(p => p?.updateScene?.(scene))
  },[gl, scene])
  
  useEffect(() => {
  const { projection, view, position } = getLookAtMatrices(camera)
  const cameraValues = { projection, view, cameraPosition: position }
  Object.values(programs).forEach(p => p?.updateViews?.(cameraValues))
  }, [camera])
  
  useEffect(() => { updateShadowsRef.current = true }, [obj])
  
  useEffect(() => {
    return () => { Object.values(programs).forEach(p => p?.cleanup()) }
  }, [])

  useEffect(() => {
    const time = Date.now()
    draw(time)
    return () => { requestId.current && cancelAnimationFrame(requestId.current) }
  }, [draw])
  
  function draw(time: number): void {
    if (updateShadowsRef.current) {
      drawShadows(time)
      updateShadowsRef.current = false
    }
    
    drawObjects(time)
    requestId.current = requestAnimationFrame(draw)
  }
}
