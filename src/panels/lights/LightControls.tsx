import { ReactElement, useCallback, useContext } from "react"
import { HorizontalPreciseSlider, VerticalPreciseSlider } from "../../components/PrecisionSlider"
import { AppContext } from "../../state/context"
import { LightComponent } from "./LightComponent"
import "./LightControls.css"

export function LightControls(): ReactElement {
  const { light, lightDispatch } = useContext(AppContext)

  const setThetaRotation = useCallback((a: number) => { 
    lightDispatch({ type: 'setThetaRotation', rotation: { theta: a, phi: 0 }})
  }, [lightDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    lightDispatch({ type: 'setPhiRotation', rotation: { theta: 0, phi: a }})
  }, [lightDispatch])
  
  return (
    <div className='light-controls'>
      <div className='light-controls-vertical'> 
        <LightComponent />
        <VerticalPreciseSlider
          value={light.rotation.theta}
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
        value={light.rotation.phi}
        defaultValue={0}
      />
    </div>
  )
}
