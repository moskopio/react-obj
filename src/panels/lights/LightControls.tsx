import { ReactElement, useCallback, useContext } from "react"
import { HorizontalPreciseSlider, VerticalPreciseSlider } from "src/components/PrecisionSlider"
import { AppContext } from "src/state/context"
import { LightComponent } from "./LightComponent"
import "./LightControls.css"

export function LightControls(): ReactElement {
  const { scene, sceneDispatch } = useContext(AppContext)

  const setThetaRotation = useCallback((a: number) => { 
    sceneDispatch({ type: "set", light: { rotation: { theta: a }}})
  }, [sceneDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    sceneDispatch({ type: "set", light: { rotation: { phi: a }}})
  }, [sceneDispatch])
  
  return (
    <div className="light-controls">
      <div className="light-controls-vertical"> 
        <LightComponent />
        <VerticalPreciseSlider
          value={scene.light.rotation.theta}
          min={180}
          max={-180}
          defaultValue={0}
          onChange={setThetaRotation}
        />
      </div>
      <HorizontalPreciseSlider
        min={-180}
        max={180}
        onChange={setPhiRotation}
        value={scene.light.rotation.phi}
        defaultValue={0}
      />
    </div>
  )
}
