import { ReactElement, useCallback, useRef } from "react"
import { Color, vec3ToCSSColor } from "src/utils/color"
import "./ColorPicker.css"
import { Slider } from "./Slider"

interface Props {
  onChange: (color: Color) => void
  value:    Color
}

export function ColorPicker(props: Props): ReactElement {
  const { value, onChange } = props
  const colorRef = useRef(value)
  
  const onRChange = useCallback((r: number) => {
    const color = colorRef.current
    onChange([Math.floor(r), color[1], color[2]])
    colorRef.current[0] = Math.floor(r)
  },[onChange, colorRef])
  
  const onGChange = useCallback((g: number) => {
    const color = colorRef.current
    onChange([color[0], Math.floor(g), color[2]])
    colorRef.current[1] = Math.floor(g)
  },[onChange, colorRef])
  
  const onBChange = useCallback((b: number) => {
    const color = colorRef.current
    onChange([color[0], color[1], Math.floor(b)])
    colorRef.current[2] = Math.floor(b)
  },[onChange, colorRef])
  
  return (
    <div className="color-picker">
      <div className="color-picker-preview">
        <div className="color-picker-display" style={ { backgroundColor: `${vec3ToCSSColor(colorRef.current)}` } } />
        <div className="color-picker-label">{vec3ToCSSColor(colorRef.current)}</div>
      </div>
      <div className="color-picker-controls">
        <Slider 
          label={`R: ${colorRef.current[0]}`} 
          onChange={onRChange}
          min={0} max={255}
          value={colorRef.current[0]}
          defaultValue={value[0]}
          color="linear-gradient(90deg, #666, #BF5C38)"
        />
        <Slider 
          label={`G: ${colorRef.current[1]}`} 
          onChange={onGChange}
          min={0} max={255}
          value={colorRef.current[1]}
          defaultValue={value[1]}
          color="linear-gradient(90deg, #666, #B2C99E)"
        />
        <Slider 
          label={`B: ${colorRef.current[2]}`} 
          onChange={onBChange}
          min={0} max={255}
          value={colorRef.current[2]}
          defaultValue={value[2]}
          color="linear-gradient(90deg, #666, #628090)"
        />
      </div>
    </div>
  )
}
