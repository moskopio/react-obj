import { useContext, useEffect } from "react"
import { AppContext } from "src/state/context"
import { Resolution } from "src/types"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: Resolution
}

export function useAdjustResolution(props: Props): void {
  const { gl, resolution } = props
  const { cameraDispatch } = useContext(AppContext)
  
  useEffect(() => {
    gl?.viewport(0, 0, resolution.width, resolution.height)
    gl?.enable(gl.DEPTH_TEST)
    gl?.enable(gl.CULL_FACE)
    cameraDispatch({ type: 'set', aspectRatio: resolution.width / resolution.height })
  }, [gl, resolution])
}
