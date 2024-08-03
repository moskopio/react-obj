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
  const { setPosition, setRotation } = useContext(AppContext)
  
  const limitRotation = useCallback((rotation: number): number => {
    return rotation > -360
      ? rotation < 360
        ? rotation
        : rotation - 720
      : 720 - rotation
  }, [])
  
  const limitPosition = useCallback((position: number): number => {
    return position > -10
      ? position < 10
        ? position
        : -10
      : 10
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
      setPosition(d => [d[0], d[1], d[2] + delta])
    }
    
    function updateRotation(event: MouseEvent): void {
      const mouseX = Math.round(event.clientX)
      const mouseY = Math.round(event.clientY)
      const xDelta = (mouseX - previousPosition[0]) * SENSITIVITY
      const yDelta = (mouseY - previousPosition[1]) * SENSITIVITY
      
      setRotation(r => [limitRotation(r[0] - yDelta), limitRotation(r[1] - xDelta), r[2]])
      previousPosition[0] = event.clientX
      previousPosition[1] = event.clientY
    }
  
  },[canvasRef, setRotation, setPosition, limitRotation, limitPosition])
}
