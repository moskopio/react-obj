import { ReactElement, useMemo, useRef } from "react"
import { getPercentage } from "src/utils/util"
import { useSliderMouseDrag } from "./hooks/slider-mouse-drag"
import "./PrecisionSlider.css"

const TRACK_SIZE = 6

interface Props {
  min:           number
  max:           number
  onChange:      (value: number) => void
  value:         number
  defaultValue?: number
}

// TODO: QUITE UGLY! NEEDS TO LOOK BETTER!
export function HorizontalPreciseSlider(props: Props): ReactElement { 
  const { min, max, onChange, value } = props
  const { defaultValue = 0 } = props
  const sliderRef = useRef<HTMLDivElement | null>(null)

  useSliderMouseDrag({ sliderRef, min, max, onChange, defaultValue })
  
  const handlePosition = useMemo(() => getPercentage(value, min, max) - TRACK_SIZE / 2 , [value, min, max])
  const handleStyle = useMemo(() => ({
      left:  `${handlePosition}%`,
      width: `${TRACK_SIZE}%`
  }), [handlePosition])
  
  return (
    <div className="precise-slider-horizontal" ref={sliderRef}>
      <div className="precise-slider-horizontal-handle" style={handleStyle} />
    </div>
  )
}

export function VerticalPreciseSlider(props: Props): ReactElement {
  const { min, max, onChange, value } = props
  const { defaultValue = 0 } = props
  const sliderRef = useRef<HTMLDivElement | null>(null)
  
  useSliderMouseDrag({ sliderRef, min, max, onChange, defaultValue, vertical: true })
  
  const handlePosition = useMemo(() => getPercentage(value, min, max) - TRACK_SIZE / 2 , [value, min, max])
  const handleStyle = useMemo(() => ({
      top:    `${handlePosition}%`,
      height: `${TRACK_SIZE}%`
  }), [handlePosition])
  
  return (
    <div className="precise-slider-vertical" ref={sliderRef}>
      <div className="precise-slider-vertical-handle" style={handleStyle} />
    </div>
  )
}

