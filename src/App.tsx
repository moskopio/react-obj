import { ReactNode } from "react"
import { WebGLPreview } from "src/preview/WebGLPreview"
import { AppContext, useAppState } from "src/state/context"
import { ObjContext, useObjState } from "src/state/obj"
import { Panels } from "src/panels/Panels"


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
