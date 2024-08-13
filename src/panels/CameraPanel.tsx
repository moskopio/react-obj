import { ReactElement, useCallback, useContext } from "react"
import { Divider } from "../components/Divider"
import { Panel } from "../components/Panel"
import { Slider } from "../components/Slider"
import { AppContext } from "../state/context"
import { createPallette, PASTEL_COLORS } from "../utils/color"

export function CameraPanel(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  const pallette = createPallette()
  
  const setThetaRotation = useCallback((a: number) => { 
    cameraDispatch({ type: 'setThetaRotation', rotation: { theta: a, phi: 0 }})
  }, [cameraDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    cameraDispatch({ type: 'setPhiRotation', rotation: { theta: 0, phi: a }})
  }, [cameraDispatch])
  
  const updateXTrack = useCallback((v: number) => {
    cameraDispatch({ type: 'setXTrack', track: { x: v, y: 0 } })
  }, [cameraDispatch])
  
  const updateYTrack = useCallback((v: number) => {
    cameraDispatch({ type: 'setYTrack', track: { x: 0, y: v } })
  }, [cameraDispatch])
  
  const setDolly = useCallback((dolly: number) => {
    cameraDispatch({ type: 'setDolly', dolly })
  }, [cameraDispatch])
  
  return (
    <Panel icon='camera' color={PASTEL_COLORS.sirocco}>

      <Slider
        label={`Theta: ${Math.floor(camera.rotation.theta)}°`}
        min={-360}
        max={360}
        onChange={setThetaRotation}
        value={camera.rotation.theta}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Phi: ${Math.floor(camera.rotation.phi)}°`}
        min={-360} 
        max={360} 
        onChange={setPhiRotation}
        value={camera.rotation.phi}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      
      <Divider />

      <Slider
        label={`Track X: ${camera.track.x.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateXTrack}
        defaultValue={0}
        value={camera.track.x}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Track Y: ${camera.track.y.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateYTrack}
        defaultValue={0}
        value={camera.track.y}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Dolly ${camera.dolly.toFixed(2)}`} 
        min={0}
        max={10}
        onChange={setDolly}
        defaultValue={2.5}
        value={camera.dolly}
        color={pallette.getNextColor()}
      />
    </Panel>
  )
}

