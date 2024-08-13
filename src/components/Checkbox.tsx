import { ReactElement, useCallback, useMemo } from "react"
import './Checkbox.css'
import { PASTEL_COLORS } from "../utils/color"

interface Props {
  label:     string
  onChange: (value: boolean) => void
  value:     boolean
  color?:    string
}

export function Checkbox(props: Props): ReactElement {
  const { value, label, onChange} = props
  const { color = PASTEL_COLORS.mojo } = props
  
  const onClick = useCallback(() => onChange(!value), [value, onChange])
  
  const checkStyle = useMemo(() => ({
    background: `${value ? color : 'transparent'}`
}), [value, color])

  
  return (
    <div className="checkbox" onClick={onClick} > 
      <div className='checkbox-box' style={checkStyle} />
      <div className="checkbox-label">{label}</div>
    </div>
  )
}
