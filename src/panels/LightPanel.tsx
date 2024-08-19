import { ReactElement, useCallback, useContext } from "react"
import { Divider } from "../components/Divider"
import { Panel } from "../components/Panel"
import { Slider } from "../components/Slider"
import { AppContext } from "../state/context"
import { createPallette, PASTEL_COLORS } from "../utils/color"
import { LightController } from "./light/LightController"
import { Checkbox } from "../components/Checkbox"

export function LightPanel(): ReactElement {
  const { light, lightDispatch } = useContext(AppContext)
  const pallette = createPallette()
  
  const setThetaRotation = useCallback((a: number) => { 
    lightDispatch({ type: 'setThetaRotation', rotation: { theta: a, phi: 0 }})
  }, [lightDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    lightDispatch({ type: 'setPhiRotation', rotation: { theta: 0, phi: a }})
  }, [lightDispatch])
  
  const setSpecularIntensity = useCallback((v: number) => { 
    lightDispatch({ type: 'setSpecularIntensity', specular: { intensity: v } })
  }, 
  [lightDispatch])
  
  const toggleSpecular = useCallback((v: boolean) => { 
    lightDispatch({ type: 'toggleSpecular', specular: { enabled: v } })
  }, 
  [lightDispatch])
  
  return (
    <Panel icon='light' color={PASTEL_COLORS.mojo}>
      
      <LightController />
      
      <Divider label='Position' />
      
      <Slider
        label={`Theta: ${Math.floor(light.rotation.theta)}°`}
        min={-360}
        max={360}
        onChange={setThetaRotation}
        value={light.rotation.theta}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Phi: ${Math.floor(light.rotation.phi)}°`}
        min={-360}
        max={360}
        onChange={setPhiRotation}
        value={light.rotation.phi}
        defaultValue={0}
        color={pallette.getNextColor()}
      />
      
      <Divider label='Specular' />
      
      <Checkbox 
        label="Enable Specular" 
        value={light.specular.enabled}
        onChange={toggleSpecular}
        color={pallette.getNextColor()}
      />
        
      <Slider
        label={`Intensity: ${Math.floor(light.specular.intensity)}`}
        min={1}
        max={2000}
        onChange={setSpecularIntensity}
        value={light.specular.intensity}
        defaultValue={1000}
        color={pallette.getNextColor()}
      />
      
    </Panel>
  )
}


