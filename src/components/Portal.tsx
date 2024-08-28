import { ReactElement, useEffect, useMemo } from "react"
import './Portal.css'


interface Props {
  position: [x: number, y: number]
  children: ReactElement | ReactElement[] | string
  label:    string
  onClose:  () => void
}

export function Portal(props: Props): ReactElement {
  const { position, children, label, onClose } = props
  const [x, y] = position
  
  const style = useMemo(() => ({
    top:  `${y}px`,
    left: `${x}px`,
  }), [position])
  
  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown)
    
    return () => document.removeEventListener('mousedown', onMouseDown)
    
    function onMouseDown(event: MouseEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      onClose()
    }
  }, [onClose])
  
  return (
    <div className='portal' style={style}>
      <div className='portal-bar' onClick={onClose}>
        <div className='portal-label'>{label}</div>
      </div>
      {children}
    </div>
  )
}
