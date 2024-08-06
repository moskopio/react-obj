import { MutableRefObject, useContext, useEffect, useRef } from "react"
import { AppContext } from "../state/context"
import './WebGLPreview.css'

const SENSITIVITY = 0.5
const WHEEL_STEP = 0.2

interface ControlProps {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
}

export function useCameraControls(props: ControlProps): void {
  const { canvasRef } = props
  const {cameraDispatch } = useContext(AppContext)
  const shift = useRef(false)
  const position = useRef([0, 0])
  
  
  useEffect(() => {
    const canvas = canvasRef.current
    
    canvas?.addEventListener('mousedown', onMouseDown)
    canvas?.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    
    return () => {
      canvas?.removeEventListener('contextmenu', onMouseDown)
      canvas?.removeEventListener('wheel', onWheel)
      canvas?.removeEventListener('mouseup', onMouseUp)
      canvas?.removeEventListener('mousemove', onMouseMove)
      canvas?.removeEventListener('mouseleave', onMouseUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
    
    function onMouseDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      canvas?.addEventListener('mouseup', onMouseUp)
      canvas?.addEventListener('mouseleave', onMouseUp)
      canvas?.addEventListener('mousemove', onMouseMove)
      position.current = [event.clientX, event.clientY]
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
    
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Shift') {
        console.log('shift! down')
        shift.current = true
      }
    }
    
    function onKeyUp(event: KeyboardEvent): void {
      if (event.key === 'Shift') { 
        console.log('shift! up')
          shift.current = false
      }
    }
    
    function onWheel(event: WheelEvent): void {
      event.stopImmediatePropagation()
      updateDistance(event)
    }
    
    function updateDistance(event: WheelEvent): void {
      const delta = (event.deltaY > 0 ? WHEEL_STEP : -WHEEL_STEP)
      cameraDispatch({ type: 'updateDolly', dolly: delta } )
    }
    
    function updateRotation(event: MouseEvent): void {
      const mouseX = Math.round(event.clientX)
      const mouseY = Math.round(event.clientY)
      const [prevX, prevY] = position.current 
      const xDelta = (mouseX - prevX) * SENSITIVITY
      const yDelta = (mouseY - prevY) * SENSITIVITY
      
      if (shift.current) {
        // sensitivity shoud be based on distance! 
        cameraDispatch({ type: 'updateTrack', track: { x: xDelta / 50, y: -yDelta / 50 } })
      } else {
        cameraDispatch({ type: 'updateRotation', rotation: { theta: -yDelta, phi: xDelta } } )
      }
      
      position.current  = [event.clientX, event.clientY]
    }
  
  },[canvasRef, cameraDispatch])
}
