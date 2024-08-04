import { ReactElement } from "react"
import "./Panel.css"

interface Props {
  children: ReactElement[]
}

export function Panel(props: Props): ReactElement {
  const { children } = props

  return (
    <div className="panel">
      {...children}
    </div>
  )
}
