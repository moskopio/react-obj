import { ReactElement, useMemo, useRef } from "react"
import './PrecisionSlider.css'
import { getPercentage } from "./utils/common"
import { useSliderMouseDrag } from "./hooks/slider-mouse-drag"
import { useSliderMouseWheel } from "./hooks/slider-mouse-wheel"

const TRACK_SIZE = 6

interface Props {
  min:           number
  max:           number
  onChange:      (value: number) => void
  value:         number
  defaultValue?: number
}


export function HorizontalPreciseSlider(props: Props): ReactElement { 
  const { min, max, onChange, value } = props
  const { defaultValue = 0 } = props
  const sliderRef = useRef<HTMLDivElement | null>(null)

  useSliderMouseDrag({ sliderRef, min, max, onChange, defaultValue })
  useSliderMouseWheel({ sliderRef, min, max, onChange, value })
  
  const handlePosition = useMemo(() => getPercentage(value, min, max) - TRACK_SIZE / 2 , [value, min, max])
  
  const handleStyle = useMemo(() => ({
      left:  `${handlePosition}%`,
      width: `${TRACK_SIZE}%`
  }), [handlePosition])
  
  return (
    <div className='precise-slider-horizontal' ref={sliderRef}>
      <div className='precise-slider-horizontal-handle' style={handleStyle} />
    </div>
  )
}

export function VerticalPreciseSlider(props: Props): ReactElement {
  const { min, max, onChange, value } = props
  const { defaultValue = 0 } = props
  const sliderRef = useRef<HTMLDivElement | null>(null)
  
  useSliderMouseDrag({ sliderRef, min, max, onChange, defaultValue, vertical: true })
  useSliderMouseWheel({ sliderRef, min, max, onChange, value, vertical: true })
  
  const handlePosition = useMemo(() => getPercentage(value, min, max) - TRACK_SIZE / 2 , [value, min, max])
  const handleStyle = useMemo(() => ({
      top:    `${handlePosition}%`,
      height: `${TRACK_SIZE}%`
  }), [handlePosition])
  
  return (
    <div className='precise-slider-vertical' ref={sliderRef}>
      <div className='precise-slider-vertical-handle' style={handleStyle} />
    </div>
  )
}

