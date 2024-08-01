import { MutableRefObject, ReactElement, useCallback, useEffect, useRef } from "react"
import './Slider.css'

interface Props {
  label:         string
  min:           number
  max:           number
  onChange:      (value: number) => void
  value:         number
  defaultValue?: number
}

export function Slider(props: Props): ReactElement {
  const { label, min, max, onChange, value, defaultValue = 0 } = props
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const getPercentage = useCallback((v: number) => ((v - min) / (max - min)) * 100, [min, max])
  
  useControls({ sliderRef, min, max, onChange, defaultValue })
  
  return (
    <div ref={sliderRef} className="slider-track">
      <div className="slider-label">{label}</div>
      <div className="slider-handle" style={{ width: `${getPercentage(value)}%` }} />
  </div>
  )
}

interface ControlProps {
  sliderRef:    MutableRefObject<HTMLElement | null>
  max:          number
  min:          number
  defaultValue: number
  onChange:     (value: number) => void
}
 
function useControls(props: ControlProps): void {
  const { sliderRef, onChange, min, max, defaultValue } = props
  
  const updateValue = useCallback((event: MouseEvent) => {
    if (sliderRef.current) {
      const boundingRect = sliderRef.current?.getBoundingClientRect()
      const boundingLeft = Math.round(boundingRect.left)
      const boundingRight = Math.round(boundingRect.right)
      
      const mouseX = Math.round(event.clientX)
      const constrainedX = constrain(mouseX, boundingLeft, boundingRight)
      
      const percentage = (constrainedX - boundingLeft) / (boundingRight -boundingLeft)
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
      document?.removeEventListener('mouseup', onMouseUp)
      document?.removeEventListener('mousemove', onMouseMove)
    }
    
    function onContextMenu(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      onChange(defaultValue)
    }
    
    function onMouseDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateValue(event)
      document?.addEventListener('mouseup', onMouseUp)
      document?.addEventListener('mousemove', onMouseMove)
    }
    
    function onMouseUp(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      document?.removeEventListener('mouseup', onMouseUp)
      document?.removeEventListener('mousemove', onMouseMove)
    }
    
    function onMouseMove(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateValue(event)
    }
  }, [sliderRef, updateValue])
}

function constrain(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min)
}
