import { ReactElement, ReactNode, useMemo, useState } from "react"
import './App.css'
import { ControlsPanel } from "./components/ControlsPanel"
import { WebGLPreview } from "./webgl/WebGLPreview"
import { EMPTY_OBJ, StateContext } from "./state"
import { Obj } from "./types"


export function App(): ReactNode {  
  const [obj, setObj] = useState<Obj>(EMPTY_OBJ)
  
  const state = useMemo(() => ({
    obj, setObj
  }),[obj, setObj])
  
  
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
