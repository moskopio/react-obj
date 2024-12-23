import { ReactElement, useEffect, useMemo, useRef, useState } from "react"
import { constrain } from "src/utils/util"
import { CameraPanel } from "./CameraPanel"
import { FileInputControls } from "./FileInput"
import { LightPanel } from "./LightPanel"
import { ObjPanel } from "./ObjPanel"
import "./Panels.css"
import { SettingsPanel } from "./SettingsPanel"

const MARGIN = 8
const SCROLL_SPEED = 20
const EVENT_SENSITIVITY = 0.3

export function Panels(): ReactElement {
  const panelsRef = useRef<HTMLDivElement | null>(null)
  const [scroll, setScroll] = useState(0)
  const touches = useRef<TouchList | null>(null)
  const shift = useRef(false)

  const style = useMemo(() => ({
    marginTop: `${MARGIN}px`,
    top:       `${scroll}px`
  }), [scroll])
  
  useEffect(() => {
    const panels = panelsRef.current
    panels?.addEventListener("wheel", onWheel)
    panels?.addEventListener("touchstart", onTouchStart)
    return () => {
      panels?.removeEventListener("wheel", onWheel)
    }
    
    function onTouchStart(event: TouchEvent): void {
      touches.current = event.touches
      if (event.touches.length > 1) {
        event.preventDefault()
        event.stopImmediatePropagation()
        
        shift.current  = true
        touches.current = event.touches
        
        panels?.removeEventListener('touchend',    onTouchEnd)
        panels?.removeEventListener('touchcancel', onTouchEnd)
        panels?.removeEventListener('touchmove',   onTouchMove)
      }
    }
    
    function onTouchEnd(): void {
      panels?.removeEventListener('touchend',    onTouchEnd)
      panels?.removeEventListener('touchcancel', onTouchEnd)
      panels?.removeEventListener('touchmove',   onTouchMove)
      shift.current = false
    }
    
    function onTouchMove(event: TouchEvent): void {
      const firstTouch = touches.current![0]
      const lastTouch = event.touches[0]
      
      const yDelta = (lastTouch.clientY - firstTouch.clientY) * EVENT_SENSITIVITY
      
      const panelsHeight = (panels?.getBoundingClientRect().height || 0) + MARGIN
      
      const heightDiff = panelsHeight - window.innerHeight
      if (heightDiff > 0) {
        const change = yDelta > 0 ? -SCROLL_SPEED : SCROLL_SPEED
        setScroll(constrain(scroll + change, -heightDiff, 0))
      }
      
    }
    
    function onWheel(event: WheelEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      
      const panelsHeight = (panels?.getBoundingClientRect().height || 0) + MARGIN
      
      const heightDiff = panelsHeight - window.innerHeight
      if (heightDiff > 0) {
        const change = event.deltaY > 0 ? -SCROLL_SPEED : SCROLL_SPEED
        setScroll(constrain(scroll + change, -heightDiff, 0))
      }
    }
  }, [panelsRef, scroll, setScroll])
  
  useEffect(() => {
    const panels = panelsRef.current
    const resizeObserver = new ResizeObserver(() => {
      const windowHeight = window.innerHeight
      const panelsHeight = (panels?.getBoundingClientRect().height || 0) + MARGIN
      panelsHeight < windowHeight && setScroll(0)
    })
    panels && resizeObserver.observe(panels)
    return () => resizeObserver.disconnect()
  }, [panelsRef, setScroll])
  
  return (
    <div className="panels" ref={panelsRef} style={style}>
      <FileInputControls />
      <ObjPanel />
      <SettingsPanel />
      <CameraPanel />
      <LightPanel />
    </div>
  )
}
