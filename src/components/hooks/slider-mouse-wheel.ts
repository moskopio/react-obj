import { MutableRefObject, useCallback, useEffect } from "react"
import { constrain } from "src/utils/util"

const WHEEL_STEP = 0.01

interface Props {
  sliderRef: MutableRefObject<HTMLElement | null>
  max:       number
  min:       number
  onChange:  (value: number) => void
  value:     number
  vertical?: boolean
}
 
export function useSliderMouseWheel(props: Props): void {
  const { sliderRef, onChange, min, max, value, vertical } = props
  
  const updateOnWheel = useCallback((event: WheelEvent) => {
    const change = (event.deltaY > 0 ? WHEEL_STEP : -WHEEL_STEP)
    // Note: Slider could have reverse order! This will result in min > max
    const newValue = constrain(value + change * (max - min), Math.min(min, max), Math.max(min, max))
    onChange(newValue)
  }, [onChange, min, max, value, vertical])
  
  useEffect(() => {
    const slider = sliderRef?.current
    slider?.addEventListener('wheel', onWheel, { passive: false })
    
    return () => {
      slider?.removeEventListener('wheel', onWheel)
    }

    function onWheel(event: WheelEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      updateOnWheel(event)
    }
    
  }, [sliderRef, updateOnWheel])
}
