import { ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "../components/Checkbox"
import { ColorPicker } from "../components/ColorPicker"
import { Divider } from "../components/Divider"
import { Panel } from "../components/Panel"
import { Slider } from "../components/Slider"
import { AppContext } from "../state/context"
import { Color, createPallette, Pallette, PASTEL_COLORS } from "../utils/color"
import { ColorPortal } from "./colors/ColorPortal"
import "./LightPanel.css"
import { LightControls } from "./lights/LightControls"

export function LightPanel(): ReactElement {
  const pallette = createPallette()
  
  return (
    <Panel icon="light" color={PASTEL_COLORS.mojo}>
      
      <LightControls />
      
      <Divider label="Colors" />
      <AmbientLight  pallette={pallette} />
      <DiffuseLight  pallette={pallette} />
      <SpecularLight pallette={pallette} />

    </Panel>
  )
}

interface Props {
  pallette: Pallette
}

function AmbientLight(props: Props): ReactElement {
  const { pallette } = props
  const { light, lightDispatch } = useContext(AppContext)

  const toggleAmbient = useCallback((enabled: boolean) => {
    lightDispatch({ type: "set", ambient: { enabled } })
  },[lightDispatch])
  
  const setAmbientColor = useCallback((color: Color) => {
    lightDispatch({ type: "set", ambient: { color } })
  },[lightDispatch])
  
  return (
    <div className="horizontal-color-setting">
      <Checkbox 
        label="Ambient Light"
        value={light.ambient.enabled}
        onChange={toggleAmbient}
        color={pallette.getNextColor()}
      />
      <ColorPortal label="Ambient Light" color={light.ambient.color}>
        <ColorPicker
          value={light.ambient.color}
          onChange={setAmbientColor}
        />
      </ColorPortal>
    </div>
  )
}

function DiffuseLight(props: Props): ReactElement {
  const { pallette } = props
  const { light, lightDispatch } = useContext(AppContext)

  const toggleDiffuse = useCallback((enabled: boolean) => {
    lightDispatch({ type: "set", diffuse: { enabled } })
  },[lightDispatch])
  
  const setDiffuseColor = useCallback((color: Color) => {
    lightDispatch({ type: "set", diffuse: { color } })
  },[lightDispatch])
  
  return (
    <div className="horizontal-color-setting">
      <Checkbox 
        label="Diffuse Light"
        value={light.diffuse.enabled}
        onChange={toggleDiffuse}
        color={pallette.getNextColor()}
      />
      <ColorPortal label="Ambient" color={light.diffuse.color}>
        <ColorPicker
          value={light.diffuse.color}
          onChange={setDiffuseColor}
        />
      </ColorPortal>
    </div>
  )
}

function SpecularLight(props: Props): ReactElement {
  const { pallette } = props
  const { light, lightDispatch } = useContext(AppContext)
  
  const toggleSpecular = useCallback((enabled: boolean) => { 
    lightDispatch({ type: "set", specular: { enabled } })
  }, [lightDispatch])
  
  const setSpecularColor = useCallback((color: Color) => {
    lightDispatch({ type: "set", specular: { color } })
  }, [lightDispatch])
  
  const setSpecularIntensity = useCallback((intensity: number) => { 
    lightDispatch({ type: "set", specular: { intensity } })
  }, [lightDispatch])
  
  return (
    <div className="horizontal-color-setting">
      <Checkbox 
        label="Specular Light"
        value={light.specular.enabled}
        onChange={toggleSpecular}
        color={pallette.getNextColor()}
      />
      <ColorPortal label="Specular" color={light.specular.color}>
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
    </div>
  )
}
