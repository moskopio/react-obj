import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Divider } from "src/components/Divider"
import { Panel } from "src/components/Panel"
import { Slider } from "src/components/Slider"
import { AppContext } from "src/state/context"
import { createPallette, PASTEL_COLORS } from "src/utils/color"

export function CameraPanel(): ReactElement {
  return (
    <Panel icon="camera" color={PASTEL_COLORS.pancho}>
      <Rotation />
      <Position />
      <Camera />
    </Panel>
  )
}

function Rotation(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  const pallette = createPallette(0)
  
  const setThetaRotation = useCallback((a: number) => { 
    cameraDispatch({ type: "set", rotation: { theta: a }})
  }, [cameraDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    cameraDispatch({ type: "set", rotation: { phi: a }})
  }, [cameraDispatch])
  
  return (
    <Fragment>
      <Divider label="Rotation" />
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
    </Fragment>
  )
}

function Position(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  const pallette = createPallette(2)
  
  const updateXTrack = useCallback((v: number) => {
    cameraDispatch({ type: "set", track: { x: v } })
  }, [cameraDispatch])
  
  const updateYTrack = useCallback((v: number) => {
    cameraDispatch({ type: "set", track: { y: v } })
  }, [cameraDispatch])
  
  const setDolly = useCallback((dolly: number) => {
    cameraDispatch({ type: "set", dolly })
  }, [cameraDispatch])
  
  return (
    <Fragment>
      <Divider label="Position" />
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
    </Fragment>
  )
}

function Camera(): ReactElement {
  const { camera, cameraDispatch } = useContext(AppContext)
  const pallette = createPallette(5)

  const setFOV = useCallback((fov: number) => {
    cameraDispatch({ type: "set", fov: Math.floor(fov) })
  }, [cameraDispatch])
  
  const setZNear = useCallback((zNear: number) => {
    cameraDispatch({ type: "set", zNear })
  }, [cameraDispatch])
  
  const setZFar = useCallback((zFar: number) => {
    cameraDispatch({ type: "set", zFar })
  }, [cameraDispatch])
  
  return (
    <Fragment>
      <Divider label="Camera" />
      <Slider
        label={`FOV ${Math.floor(camera.fov)}`} 
        min={1}
        max={180}
        onChange={setFOV}
        defaultValue={60}
        value={camera.fov}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`ZNear ${camera.zNear.toFixed(2)}`} 
        min={-100}
        max={100}
        onChange={setZNear}
        defaultValue={0}
        value={camera.zNear}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`ZFar ${camera.zFar.toFixed(2)}`} 
        min={1}
        max={100}
        onChange={setZFar}
        defaultValue={50}
        value={camera.zFar}
        color={pallette.getNextColor()}
      />
    </Fragment>
  )
}
