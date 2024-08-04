import { ReactElement, ReactNode } from "react"
import './App.css'
import { ControlsPanel } from "./components/ControlsPanel"
import { WebGLPreview } from "./preview/WebGLPreview"
import { AppContext, useAppState } from "./state/context"


export function App(): ReactNode {  
  const state = useAppState()

  return (
    <AppContext.Provider value={state}>
      <div className="application">
        <Preview />
        <Panels />
      </div>
    </AppContext.Provider>
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
