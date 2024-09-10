import { MutableRefObject, useCallback, useEffect } from "react"
import { constrain } from "src/utils/util"

interface Props {
  sliderRef:    MutableRefObject<HTMLElement | null>
  max:          number
  min:          number
  defaultValue: number
  onChange:     (value: number) => void
  vertical?:    boolean
}
 
export function useSliderMouseDrag(props: Props): void {
  const { sliderRef, onChange, min, max, defaultValue, vertical } = props
  
  const updateOnMouseMove = useCallback((event: MouseEvent) => {
    if (sliderRef.current) {
      const boundingRect = sliderRef.current?.getBoundingClientRect()
      const boundingMax = Math.round(vertical ? boundingRect.top : boundingRect.left)
      const boundingMin = Math.round(vertical ? boundingRect.bottom : boundingRect.right)
      
      const mousePos = Math.round(vertical ? event.clientY: event.clientX)
      const constrainedMousePos = constrain(mousePos, boundingMax, boundingMin)
      
      const percentage = (constrainedMousePos - boundingMax) / (boundingMin - boundingMax)
      
      onChange(min + percentage * (max - min))
    }
  }, [onChange, min, max, sliderRef])
  
  
  useEffect(() => {
    const slider = sliderRef?.current
    slider?.addEventListener('contextmenu', onContextMenu)
    slider?.addEventListener('mousedown', onMouseDown)
    
    return () => {
      slider?.removeEventListener('contextmenu', onContextMenu)
      slider?.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
    
    function onContextMenu(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      onChange(defaultValue)
    }
    
    function onMouseDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.type !== 'contextmenu' && event.button !== 2) {
        updateOnMouseMove(event)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('mousemove', onMouseMove)
      }
    }
    
    function onMouseUp(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
    
    function onMouseMove(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateOnMouseMove(event)
    }
  
  }, [sliderRef, updateOnMouseMove])
}
