import { ReactElement, ReactNode, useMemo, useState } from "react"
import './App.css'
import { ControlsPanel } from "./components/ControlsPanel"
import { WebGLPreview } from "./webgl/WebGLPreview"
import { EMPTY_OBJ, StateContext } from "./state"
import { Vec3 } from "./utils/v3"
import { Obj } from "./utils/obj/types"


export function App(): ReactNode {  
  const [obj, setObj] = useState<Obj>(EMPTY_OBJ)
  const [rotation, setRotation] = useState<Vec3>([0, 0, 0])
  const [distance, setDistance] = useState(2)
  
  const state = useMemo(() => ({
    obj, setObj,
    rotation, setRotation,
    distance, setDistance
  }),[obj, setObj, rotation, setRotation, distance, setDistance])
  
  
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
