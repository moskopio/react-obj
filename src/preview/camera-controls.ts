import { MutableRefObject, useCallback, useContext, useEffect } from "react"
import { AppContext } from "../state"
import './WebGLPreview.css'

const SENSITIVITY = 0.5
const WHEEL_STEP = 0.2

interface ControlProps {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
}

export function useCameraControls(props: ControlProps): void {
  const { canvasRef } = props
  const { setDistance, setRotation } = useContext(AppContext)
  
  const limit = useCallback((rotation: number): number => {
    return rotation > -360
      ? rotation < 360
        ? rotation
        : rotation - 720
      : 720 - rotation
  }, [])
    
  useEffect(() => {
    const canvas = canvasRef.current
    const previousPosition = [0, 0]
    
    canvas?.addEventListener('mousedown', onMouseDown)
    canvas?.addEventListener('wheel', onWheel, { passive: true })
    
    return () => {
      canvas?.removeEventListener('contextmenu', onMouseDown)
      canvas?.removeEventListener('wheel', onWheel)
      canvas?.removeEventListener('mouseup', onMouseUp)
      canvas?.removeEventListener('mousemove', onMouseMove)
      canvas?.removeEventListener('mouseleave', onMouseUp)
    }
    
    function onMouseDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      canvas?.addEventListener('mouseup', onMouseUp)
      canvas?.addEventListener('mouseleave', onMouseUp)
      canvas?.addEventListener('mousemove', onMouseMove)
      previousPosition[0] = event.clientX
      previousPosition[1] = event.clientY
    }
    
    function onMouseUp(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      canvas?.removeEventListener('mouseup', onMouseUp)
      canvas?.removeEventListener('mouseleave', onMouseUp)
      canvas?.removeEventListener('mousemove', onMouseMove)
    }
    
    function onMouseMove(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateRotation(event)
    }
    
    function onWheel(event: WheelEvent): void {
      event.stopImmediatePropagation()
      updateDistance(event)
    }
    
    function updateDistance(event: WheelEvent): void {
      const delta = (event.deltaY > 0 ? WHEEL_STEP : -WHEEL_STEP)
      setDistance(d => d + delta)
    }
    
    function updateRotation(event: MouseEvent): void {
      const mouseX = Math.round(event.clientX)
      const mouseY = Math.round(event.clientY)
      const xDelta = (mouseX - previousPosition[0]) * SENSITIVITY
      const yDelta = (mouseY - previousPosition[1]) * SENSITIVITY
      
      setRotation(r => [limit(r[0] - yDelta), limit(r[1] - xDelta), r[2]])
      previousPosition[0] = event.clientX
      previousPosition[1] = event.clientY
    }
  
  },[canvasRef, setRotation, setDistance, limit])
}
