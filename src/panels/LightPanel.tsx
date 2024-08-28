import { ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "../components/Checkbox"
import { ColorPicker } from "../components/ColorPicker"
import { Divider } from "../components/Divider"
import { Panel } from "../components/Panel"
import { Slider } from "../components/Slider"
import { AppContext } from "../state/context"
import { createPallette, PASTEL_COLORS } from "../utils/color"
import { Vec3 } from "../utils/math/v3"
import { ColorPortal } from "./color/ColorPortal"
import { LightControls } from "./light/LightControls"
import './LightPanel.css'

export function LightPanel(): ReactElement {
  return (
    <Panel icon='light' color={PASTEL_COLORS.mojo}>
      
      <LightControls />
      
      <Divider label='Colors' />
      <div className='light-panel-colors'>
        <AmbientColor />
        <DiffuseColor />
        <SpecularColor />
      </div>

    </Panel>
  )
}

function AmbientColor(): ReactElement {
  const { light, lightDispatch } = useContext(AppContext)

  const onChange = useCallback((v: Vec3) => {
    lightDispatch({ type: 'updateAmbientColor', ambient: { color: v } })
  },[lightDispatch])
  
  return (
    <ColorPortal label='Ambient' color={light.ambient.color}>
      <ColorPicker
        value={light.ambient.color}
        onChange={onChange}
      />
    </ColorPortal>
  )
}

function DiffuseColor(): ReactElement {
  const { light, lightDispatch } = useContext(AppContext)

  const onChange = useCallback((v: Vec3) => {
    lightDispatch({ type: 'updateDiffuseColor', diffuse: { color: v } })
  },[lightDispatch])
  
  return (
    <ColorPortal label='Diffuse' color={light.diffuse.color}>
      <ColorPicker
        value={light.diffuse.color}
        onChange={onChange}
      />
    </ColorPortal>
  )
}

function SpecularColor(): ReactElement {
  const { light, lightDispatch } = useContext(AppContext)
  const pallette = createPallette()
  
  const setSpecularColor = useCallback((v: Vec3) => {
    lightDispatch({ type: 'updateSpecularColorColor', specular: { color: v } })
  }, [lightDispatch])
  
  const setSpecularIntensity = useCallback((v: number) => { 
    lightDispatch({ type: 'setSpecularIntensity', specular: { intensity: v } })
  }, [lightDispatch])
  
  const toggleSpecular = useCallback((v: boolean) => { 
    lightDispatch({ type: 'toggleSpecular', specular: { enabled: v } })
  }, [lightDispatch])

  return (
    <ColorPortal label='Specular' color={light.specular.color}>
      <Checkbox 
        label="Enabled"
        value={light.specular.enabled}
        onChange={toggleSpecular}
        color={pallette.getNextColor()}
      />
      <ColorPicker
        value={light.specular.color}
        onChange={setSpecularColor}
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
    </ColorPortal>
  )
}
