import { ReactElement } from "react"
import "./Label.css"

interface Props {
  label: string
}

export function Label(props: Props): ReactElement {
  const { label } = props
  
  return (
    <div className="label">
      {label}
    </div>
  )
}
