import { ReactElement, ReactNode } from "react"
import './App.css'
import { ControlsPanel } from "./components/ControlsPanel"
import { WebGLPreview } from "./webgl/WebGLPreview"


export function App(): ReactNode {  
  return (
    <div className="application">
      <Preview />
      <Panels />
    </div>
  )
}

function Preview(): ReactElement {
  return (
    <div className="preview">
      <WebGLPreview />
    </div>
  )
}

function Panels(): ReactElement {
  return (
    <div className="panels">
      <ControlsPanel />
    </div>
  )
}
