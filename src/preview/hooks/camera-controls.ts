import { useContext, useEffect, useRef } from "react"
import { AppContext } from "src/state/context"

const SENSITIVITY = 0.3
const WHEEL_STEP = 0.05

export function useCameraControls(): void {
  const {cameraDispatch } = useContext(AppContext)
  const shift = useRef(false)
  const position = useRef([0, 0])
  
  useEffect(() => {
    // TODO: touch gestures! It doesn't work well on mobile/tablet
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('mouseleave', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('contextmenu', onContextMenu)
    }
    
    function onContextMenu(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    
    function onPointerDown(event: MouseEvent): void {
      if (event.type === 'contextmenu' || event.button === 2) {
        shift.current = true
      }
      
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('mouseleave', onPointerUp)
      window.addEventListener('pointermove', onPointerMove)
      position.current = [event.clientX, event.clientY]
    }
    
    function onPointerUp(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.type === 'contextmenu' || event.button === 2) {
        shift.current = false
      }
      
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('mouseleave', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
    }
    
    function onPointerMove(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateRotation(event)
    }
    
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Shift') {
        shift.current = true
      }
    }
    
    function onKeyUp(event: KeyboardEvent): void {
      if (event.key === 'Shift') {
        shift.current = false
      }
    }
    
    function onWheel(event: WheelEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateDistance(event)
    }
    
    function updateDistance(event: WheelEvent): void {
      const delta = (event.deltaY > 0 ? WHEEL_STEP : -WHEEL_STEP)
      cameraDispatch({ type: 'update', dolly: delta } )
    }
    
    function updateRotation(event: MouseEvent): void {
      const mouseX = Math.round(event.clientX)
      const mouseY = Math.round(event.clientY)
      const [prevX, prevY] = position.current 
      const xDelta = (mouseX - prevX) * SENSITIVITY
      const yDelta = (mouseY - prevY) * SENSITIVITY
      
      if (shift.current) {
        // sensitivity should be based on distance!
        cameraDispatch({ type: 'update', track: { x: xDelta / 50, y: -yDelta / 50 } })
      } else {
        cameraDispatch({ type: 'update', rotation: { theta: -yDelta, phi: xDelta } } )
      }
      
      position.current = [event.clientX, event.clientY]
    }
  
  },[cameraDispatch])
}
