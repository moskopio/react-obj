import { ReactElement, useEffect, useMemo, useState } from "react"
import "./Portal.css"

interface Props {
  children: ReactElement | ReactElement[] | string | null
  label:    string
  onClose:  () => void
  position: [x: number, y: number]
}

export function Portal(props: Props): ReactElement {
  const { children, label, onClose, position } = props
  const [portal, setPortal] = useState<HTMLDivElement | null>(null)
  
  const style = useMemo(() => {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const [x, y] = position
    const boundingRect = portal?.getBoundingClientRect()
    const portalWidth = boundingRect?.width || 0
    const portalHeight = boundingRect?.height || 0
    
    const portalX = portalWidth + x > windowWidth
      ? windowWidth - portalWidth
      : x
    
    const portalY = portalHeight + y > windowHeight 
      ? windowHeight - portalHeight
      : y
    
    return { left: `${portalX}px`, top: `${portalY}px` }
  }, [position, portal])
  
  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown)
    
    return () => document.removeEventListener("mousedown", onMouseDown)
    
    function onMouseDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      onClose()
    }
  }, [onClose])
  
  return (
    <div className="portal" style={style} ref={setPortal}>
      <div className="portal-bar" onClick={onClose}>
        <div className="portal-label">{label}</div>
      </div>
      {children}
    </div>
  )
}
