import { ReactElement, useCallback, useRef, useState } from "react"
import { Portal } from "../../components/Portal"
import { vec3ToCSSColor } from "../../utils/color"
import './ColorPortal.css'

interface Props {
  children: ReactElement | ReactElement[] | string
  color:    [r: number, g: number, b: number]
  label:    string
}

export function ColorPortal(props: Props): ReactElement {
  const { children, color, label } = props
  
  const [portalVisible, setPortalVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
    
  const showPortal = useCallback(() => setPortalVisible(true), [setPortalVisible])
  const hidePortal = useCallback(() => setPortalVisible(false), [setPortalVisible])
  
  const boundingRect = containerRef.current?.getBoundingClientRect()
  const position: [number, number] = boundingRect 
    ? [boundingRect.x, boundingRect.y] 
    : [0, 0]
  
  const style = { backgroundColor: `${vec3ToCSSColor(color)}` }
  return (
    <div>
      <div
        className='color-portal-preview' 
        ref={containerRef}
        onClick={showPortal}
        style={style}
      >
        {label}
      </div>
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
