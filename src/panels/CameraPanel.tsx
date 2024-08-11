import { ReactElement, useCallback, useContext } from "react"
import { AppContext } from "../state/context"
import { Divider } from "../components/Divider"
import { Panel } from "../components/Panel"
import { Slider } from "../components/Slider"

export function CameraPanel(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  
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
    <Panel icon='camera'>

      <Slider
        label={`Theta: ${Math.floor(camera.rotation.theta)}°`}
        min={-360}
        max={360}
        onChange={setThetaRotation}
        value={camera.rotation.theta}
        defaultValue={0}
      />
      <Slider
        label={`Phi: ${Math.floor(camera.rotation.phi)}°`}
        min={-360} 
        max={360} 
        onChange={setPhiRotation}
        value={camera.rotation.phi}
        defaultValue={0}
      />
      
      <Divider />

      <Slider
        label={`Track X: ${camera.track.x.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateXTrack}
        defaultValue={0}
        value={camera.track.x}
        />
      <Slider
        label={`Track Y: ${camera.track.y.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateYTrack}
        defaultValue={0}
        value={camera.track.y}
        />
      <Slider
        label={`Dolly ${camera.dolly.toFixed(2)}`} 
        min={0}
        max={10}
        onChange={setDolly}
        defaultValue={2.5}
        value={camera.dolly}
        />
    </Panel>
  )
}

