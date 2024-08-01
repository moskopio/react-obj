import { ReactElement, ReactNode } from "react"
import './App.css'
import { ControlsPanel } from "./components/ControlsPanel"
import { WebGLPreview } from "./preview/WebGLPreview"
import { StateContext, useAppState } from "./state"


export function App(): ReactNode {  
  const state = useAppState()

  return (
    <StateContext.Provider value={state}>
      <div className="application">
        <Preview />
        <Panels />
      </div>
    </StateContext.Provider>
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
