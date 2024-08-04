import { ReactElement, ReactNode } from "react"
import './App.css'
import { ControlsPanel } from "./components/ControlsPanel"
import { WebGLPreview } from "./preview/WebGLPreview"
import { AppContext, useAppState } from "./state/context"
import { StatisticsPanel } from "./components/StatisticsPanel"
import { ObjContext, useObjState } from "./state/obj"


export function App(): ReactNode {
  const state = useAppState()
  const objState = useObjState()

  return (
    <ObjContext.Provider value={objState}>
    <AppContext.Provider value={state}>
      <div className="application">
        <Preview />
        <Panels />
      </div>
    </AppContext.Provider>
    </ObjContext.Provider>
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
      <StatisticsPanel />
    </div>
  )
}
