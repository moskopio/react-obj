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
    cameraDispatch({ type: 'set', rotation: { theta: a }})
  }, [cameraDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    cameraDispatch({ type: 'set', rotation: { phi: a }})
  }, [cameraDispatch])
  
  const updateXTrack = useCallback((v: number) => {
    cameraDispatch({ type: 'set', track: { x: v } })
  }, [cameraDispatch])
  
  const updateYTrack = useCallback((v: number) => {
    cameraDispatch({ type: 'set', track: { y: v } })
  }, [cameraDispatch])
  
  const setDolly = useCallback((dolly: number) => {
    cameraDispatch({ type: 'set', dolly })
  }, [cameraDispatch])
  
  const setFOV = useCallback((fov: number) => {
    cameraDispatch({ type: 'set', fov: Math.floor(fov) })
  }, [cameraDispatch])
  
  return (
    <Panel icon='camera' color={PASTEL_COLORS.pancho}>
      
      <Divider label='Rotation' />
      
      <Slider
        label={`Theta: ${Math.floor(camera.rotation.theta)}°`}
        min={-180}
        max={180}
        onChange={setThetaRotation}
        value={camera.rotation.theta}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Phi: ${Math.floor(camera.rotation.phi)}°`}
        min={-180}
        max={180}
        onChange={setPhiRotation}
        value={camera.rotation.phi}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      
      <Divider label='Position' />

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
      
      <Divider label='Settings' />
      <Slider
        label={`FOV ${Math.floor(camera.fov)}`} 
        min={1}
        max={180}
        onChange={setFOV}
        defaultValue={60}
        value={camera.fov}
        color={pallette.getNextColor()}
      />
      
    </Panel>
  )
}

