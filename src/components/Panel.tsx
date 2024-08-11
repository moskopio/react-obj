import { ReactElement, useCallback, useState } from "react"
import "./Panel.css"

interface Props {
  children: ReactElement[]
  icon:     string
}

export function Panel(props: Props): ReactElement {
  const { icon } = props
  const [extended, setExtended] = useState(false)
  
  const onClick = useCallback(() => setExtended(!extended), [extended, setExtended])
  
  return extended 
    ? <ExtendedPanel onClick={onClick} {...props} />
    : <div className={`panel-${icon}-icon`} onClick={onClick}></div>
}

interface ExtendedProps extends Props {
  onClick: () => void
}

function ExtendedPanel(props: ExtendedProps): ReactElement {
  const { onClick, children } = props
  
  return (
    <div className="panel">
      <div className="panel-bar" onClick={onClick} />
      <div className="panel-content">{...children}</div>
    </div>
  )
}
