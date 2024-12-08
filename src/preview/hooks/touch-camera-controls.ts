import { RefObject, useContext, useEffect, useRef } from "react"
import { AppContext } from "src/state/context"

const EVENT_SENSITIVITY = 0.3
const PINCH_SENSITIVITY = 0.02
const PINCH_THRESHOLD = 5

interface Args {
  canvasRef: RefObject<HTMLCanvasElement>
}

export function useTouchCameraControls(args: Args): void {
  const { canvasRef } = args
  const {cameraDispatch } = useContext(AppContext)
  const shift = useRef(false)
  const touches = useRef<TouchList | null>(null)
  const canvas = canvasRef.current
  
  useEffect(() => {
    canvas?.addEventListener('touchstart', onTouchStart, { passive: false })
    
    return () => {
      canvas?.removeEventListener('touchstart',  onTouchStart)
      canvas?.removeEventListener('touchend',    onTouchEnd)
      canvas?.removeEventListener('touchcancel', onTouchEnd)
      canvas?.removeEventListener('touchmove',   onTouchMove)
    }
    
    function onTouchStart(event: TouchEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      
      canvas?.addEventListener('touchend',    onTouchEnd)
      canvas?.addEventListener('touchcancel', onTouchEnd)
      canvas?.addEventListener('touchmove',   onTouchMove)
      touches.current = event.touches
      
      if (event.touches.length > 1) {
        shift.current = true
      }
    }
    
    function onTouchEnd(): void {
      canvas?.removeEventListener('touchend',    onTouchEnd)
      canvas?.removeEventListener('touchcancel', onTouchEnd)
      canvas?.removeEventListener('touchmove',   onTouchMove)
      shift.current = false
    }
    
    function onTouchMove(event: TouchEvent): void {
      updateCamera(event)
    }
    
    function updateCamera(event: TouchEvent): void {
      const firstTouch = touches.current![0]
      const lastTouch = event.touches[0]
      
      const xDelta = (lastTouch.clientX - firstTouch.clientX) * EVENT_SENSITIVITY
      const yDelta = (lastTouch.clientY - firstTouch.clientY) * EVENT_SENSITIVITY
      
      if (shift.current) {
        const firstTouchesDistance = Math.hypot(
          touches.current![0].pageX - touches.current![1].pageX,
          touches.current![0].pageY - touches.current![1].pageY)
        const lastTouchesDistance = Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY)
          
        if (Math.abs(firstTouchesDistance - lastTouchesDistance) > PINCH_THRESHOLD) {
          const delta = (firstTouchesDistance - lastTouchesDistance) * PINCH_SENSITIVITY
          cameraDispatch({ type: 'update', dolly: delta } )
        } else {
          cameraDispatch({ type: 'update', track: { x: xDelta / 50, y: -yDelta * PINCH_SENSITIVITY } })
        }
      } else {
        cameraDispatch({ type: 'update', rotation: { theta: -yDelta, phi: xDelta } } )
      }
      touches.current = event.touches
    }
  
  },[cameraDispatch, canvas])
}
