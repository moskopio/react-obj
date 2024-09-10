import { ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "src/components/Checkbox"
import { ColorPicker } from "src/components/ColorPicker"
import { Divider } from "src/components/Divider"
import { Panel } from "src/components/Panel"
import { Slider } from "src/components/Slider"
import { AppContext } from "src/state/context"
import { Color, createPallette, Pallette, PASTEL_COLORS } from "src/utils/color"
import { ColorPortal } from "./colors/ColorPortal"
import "./LightPanel.css"
import { LightControls } from "./lights/LightControls"

export function LightPanel(): ReactElement {
  const pallette = createPallette()
  const { light, lightDispatch } = useContext(AppContext)
  
  return (
    <Panel icon="light" color={PASTEL_COLORS.mojo}>
      
      <LightControls />
      <Checkbox 
        label="Follows Camera"
        value={light.followsCamera}
        onChange={(followsCamera: boolean) => lightDispatch({ type: "set", followsCamera } )}
        color={pallette.getNextColor()}
      />
      <Divider label="Colors" />
      <AmbientLight  pallette={pallette} />
      <DiffuseLight  pallette={pallette} />
      <SpecularLight pallette={pallette} />
      <FresnelLight  pallette={pallette} />
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
      <ColorPortal label="Ambient" color={light.ambient.color}>
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
      <ColorPortal label="Diffuse" color={light.diffuse.color}>
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

function FresnelLight(props: Props): ReactElement {
  const { pallette } = props
  const { light, lightDispatch } = useContext(AppContext)
  
  const toggleFresnel = useCallback((enabled: boolean) => { 
    lightDispatch({ type: "set", fresnel: { enabled } })
  }, [lightDispatch])
  
  const setFresnelColor = useCallback((color: Color) => {
    lightDispatch({ type: "set", fresnel: { color } })
  }, [lightDispatch])
  
  const setFresnelIntensity = useCallback((intensity: number) => { 
    lightDispatch({ type: "set", fresnel: { intensity } })
  }, [lightDispatch])
  
  return (
    <div className="horizontal-color-setting">
      <Checkbox 
        label="Fresnel Effect"
        value={light.fresnel.enabled}
        onChange={toggleFresnel}
        color={pallette.getNextColor()}
      />
      <ColorPortal label="Fresnel" color={light.fresnel.color}>
        <ColorPicker
          value={light.fresnel.color}
          onChange={setFresnelColor}
        />
        <Slider
          label={`Intensity: ${light.fresnel.intensity.toFixed(2)}`}
          min={0}
          max={1.0}
          onChange={setFresnelIntensity}
          value={light.fresnel.intensity}
          defaultValue={0.5}
          color={pallette.getNextColor()}
        />
      </ColorPortal>
    </div>
  )
}
