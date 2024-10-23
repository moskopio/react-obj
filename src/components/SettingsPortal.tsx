import { ReactElement, useCallback, useRef, useState } from "react"
import { IconSettings } from "./Icon"
import { Portal } from "./Portal"

interface Props {
  children: ReactElement | ReactElement[] | string | null
  label:    string
}

export function SettingsPortal(props: Props): ReactElement {
  const { children, label } = props
  
  const [portalVisible, setPortalVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
    
  const showPortal = useCallback(() => setPortalVisible(true), [setPortalVisible])
  const hidePortal = useCallback(() => setPortalVisible(false), [setPortalVisible])
  
  const boundingRect = containerRef.current?.getBoundingClientRect()
  const position: [number, number] = boundingRect 
    ? [boundingRect.x, boundingRect.y] 
    : [0, 0]
  
  return (
    <div ref={containerRef}>
      <IconSettings onClick={showPortal} />
      {portalVisible ?
        <Portal
          label={label}
          onClose={hidePortal}
          position={position}>
          {children}
        </Portal>
        : null
      }
    </div>
  )
}
