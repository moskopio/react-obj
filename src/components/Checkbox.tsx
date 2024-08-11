import { ReactElement, useCallback } from "react"
import './Checkbox.css'

interface Props {
  label:     string
  onChange: (value: boolean) => void
  value:     boolean
}

export function Checkbox(props: Props): ReactElement {
  const { value, label, onChange } = props
  
  const classes = `checkbox-box ${value && 'checked'}`
  const onClick = useCallback(() => onChange(!value), [value, onChange])
  
  return (
    <div className="checkbox" onClick={onClick} > 
      <div className={classes} />
      <div className="checkbox-label">{label}</div>
    </div>
  )
}
