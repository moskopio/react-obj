import { ReactElement, useCallback, useState } from "react"
import { PASTEL_COLORS } from "src/utils/color"
import { IconCamera, IconFile, IconInfo, IconLight, IconSettings } from "./Icon"
import "./Panel.css"

interface Props {
  children: ReactElement | ReactElement[] | string
  icon:     string
  color?:   string
}

export function Panel(props: Props): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false)
  const onClick = useCallback(() => setIsExpanded(!isExpanded), [isExpanded, setIsExpanded])
  
  return isExpanded 
    ? <ExtendedPanel onClick={onClick} {...props} />
    : <PanelIcon onClick={onClick} {...props} />
}

interface ClickableProps extends Props {
  onClick: () => void
}

function ExtendedPanel(props: ClickableProps): ReactElement {
  const { onClick, children, color = PASTEL_COLORS.mojo } = props
  
  return (
    <div className="panel">
      <div className="panel-bar" style={{background: `${color}`}} onClick={onClick} />
      <div className="panel-content">{children}</div>
    </div>
  )
}

function PanelIcon(props: ClickableProps): ReactElement {
  const { icon, onClick } = props
  
  switch (icon) {
    case "camera":   return <IconCamera onClick={onClick} />
    case "file"  :   return <IconFile onClick={onClick} />
    case "info"  :   return <IconInfo onClick={onClick} />
    case "light" :   return <IconLight onClick={onClick} />
    case "settings": return <IconSettings onClick={onClick} />
    default:         return <IconInfo onClick={onClick} />
  }
  
}
