import { RefObject, useContext, useEffect, useRef } from "react"
import { AppContext } from "../../../state/context"

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
  
    canvas?.addEventListener('mousedown', onMouseDown)
    canvas?.addEventListener('contextmenu', onContextMenu)
    
    return () => {
      canvas?.removeEventListener('mousedown', onMouseDown)
      canvas?.removeEventListener('contextmenu', onContextMenu)
      
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseUp)
    }
    
    function onContextMenu(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    
    function onMouseDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()

      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('mouseleave', onMouseUp)
      window.addEventListener('mousemove', onMouseMove)
      position.current = [event.clientX, event.clientY]
    }
    
    function onMouseUp(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
    
    function onMouseMove(event: MouseEvent): void {
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
