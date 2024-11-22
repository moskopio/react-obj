import { RefObject, useContext, useEffect, useRef } from "react"
import { AppContext } from "src/state/context"

const SENSITIVITY = 0.75

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>
}

export function useLightControls(props: Props): void {
  const { canvasRef } = props
  const { sceneDispatch } = useContext(AppContext)
  const position = useRef([0, 0])
  
  useEffect(() => {
    const canvas = canvasRef.current
  
    canvas?.addEventListener('pointerdown', onPointerDown)
    canvas?.addEventListener('contextmenu', onContextMenu)
    
    return () => {
      canvas?.removeEventListener('pointerdown', onPointerDown)
      canvas?.removeEventListener('contextmenu', onContextMenu)
      
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('mouseleave', onPointerUp)
    }
    
    function onContextMenu(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    
    function onPointerDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()

      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('mouseleave', onPointerUp)
      window.addEventListener('pointermove', onPointerMove)
      position.current = [event.clientX, event.clientY]
    }
    
    function onPointerUp(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('mouseleave', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
    }
    
    function onPointerMove(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateRotation(event)
    }
    
    function updateRotation(event: MouseEvent): void {
      const mouseX = Math.round(event.clientX)
      const mouseY = Math.round(event.clientY)
      const [prevX, prevY] = position.current 
      const xDelta = (mouseX - prevX) * SENSITIVITY
      const yDelta = (mouseY - prevY) * SENSITIVITY
    
      sceneDispatch({ type: 'update', light: { rotation: { theta: -yDelta, phi: xDelta } } })
      
      position.current = [event.clientX, event.clientY]
    }
  
  },[sceneDispatch])
}
