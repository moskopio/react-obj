import { ReactElement, useEffect, useMemo, useRef } from "react"
import { PASTEL_COLORS } from "src/utils/color"
import "./Checkbox.css"

interface Props {
  color?:    string
  label:     string
  onChange: (value: boolean) => void
  value:     boolean
}

export function Checkbox(props: Props): ReactElement {
  const { value, label, onChange} = props
  const { color = PASTEL_COLORS.mojo } = props
  const checkboxRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const checkbox = checkboxRef.current
    checkbox?.addEventListener("mousedown", onClick)
    return () => checkbox?.removeEventListener("mousedown", onClick)
    
    function onClick(event: MouseEvent): void {
      event.preventDefault()
      event.stopPropagation()
      onChange(!value)
    }
  },[onChange, checkboxRef, value])
    
  const style = useMemo(() => ({
    background: `${value ? color : "transparent"}`
  }), [value, color])

  return (
    <div className="checkbox" ref={checkboxRef} >
      <div className="checkbox-box" style={style} />
      <div className="checkbox-label">{label}</div>
    </div>
  )
}
