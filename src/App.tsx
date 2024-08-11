import { ReactNode } from "react"
import { WebGLPreview } from "./preview/WebGLPreview"
import { AppContext, useAppState } from "./state/context"
import { ObjContext, useObjState } from "./state/obj"
import { Panels } from "./panels/Panels"


export function App(): ReactNode {
  const state = useAppState()
  const objState = useObjState()

  return (
    <ObjContext.Provider value={objState}>
    <AppContext.Provider value={state}>
      <WebGLPreview />
      <Panels />
    </AppContext.Provider>
    </ObjContext.Provider>
  )
}
