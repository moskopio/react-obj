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
  const { scene, sceneDispatch } = useContext(AppContext)
  
  return (
    <Panel icon="light" color={PASTEL_COLORS.mojo}>
      
      <LightControls />
      <Checkbox 
        label="Cast Self Shadow"
        value={scene.light.castObjectShadow}
        onChange={(castObjectShadow: boolean) => sceneDispatch({ type: "set", light: { castObjectShadow }} )}
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
  const { scene: light, sceneDispatch } = useContext(AppContext)

  const toggleAmbient = useCallback((enabled: boolean) => {
    sceneDispatch({ type: "set", ambient: { enabled } })
  },[sceneDispatch])
  
  const setAmbientColor = useCallback((color: Color) => {
    sceneDispatch({ type: "set", ambient: { color } })
  },[sceneDispatch])
  
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
  const { scene, sceneDispatch } = useContext(AppContext)

  const toggleDiffuse = useCallback((enabled: boolean) => {
    sceneDispatch({ type: "set",light: {diffuse: { enabled } }})
  },[sceneDispatch])
  
  const setDiffuseColor = useCallback((color: Color) => {
    sceneDispatch({ type: "set", light: { diffuse: { color } }})
  },[sceneDispatch])
  
  return (
    <div className="horizontal-color-setting">
      <Checkbox 
        label="Diffuse Light"
        value={scene.light.diffuse.enabled}
        onChange={toggleDiffuse}
        color={pallette.getNextColor()}
      />
      <ColorPortal label="Diffuse" color={scene.light.diffuse.color}>
        <ColorPicker
          value={scene.light.diffuse.color}
          onChange={setDiffuseColor}
        />
      </ColorPortal>
    </div>
  )
}

function SpecularLight(props: Props): ReactElement {
  const { pallette } = props
  const { scene, sceneDispatch } = useContext(AppContext)
  
  const toggleSpecular = useCallback((enabled: boolean) => { 
    sceneDispatch({ type: "set", light: { specular: { enabled } } })
  }, [sceneDispatch])
  
  const setSpecularColor = useCallback((color: Color) => {
    sceneDispatch({ type: "set", light: { specular: { color } } })
  }, [sceneDispatch])
  
  const setSpecularIntensity = useCallback((intensity: number) => { 
    sceneDispatch({ type: "set", light: { specular: { intensity } } })
  }, [sceneDispatch])
  
  return (
    <div className="horizontal-color-setting">
      <Checkbox 
        label="Specular Light"
        value={scene.light.specular.enabled}
        onChange={toggleSpecular}
        color={pallette.getNextColor()}
      />
      <ColorPortal label="Specular" color={scene.light.specular.color}>
        <ColorPicker
          value={scene.light.specular.color}
          onChange={setSpecularColor}
        />
        <Slider
          label={`Intensity: ${Math.floor(scene.light.specular.intensity)}`}
          min={1}
          max={2000}
          onChange={setSpecularIntensity}
          value={scene.light.specular.intensity}
          defaultValue={1000}
          color={pallette.getNextColor()}
        />
      </ColorPortal>
    </div>
  )
}

function FresnelLight(props: Props): ReactElement {
  const { pallette } = props
  const { scene, sceneDispatch } = useContext(AppContext)
  
  const toggleFresnel = useCallback((enabled: boolean) => { 
    sceneDispatch({ type: "set", fresnel: { enabled } })
  }, [sceneDispatch])
  
  const setFresnelColor = useCallback((color: Color) => {
    sceneDispatch({ type: "set", fresnel: { color } })
  }, [sceneDispatch])
  
  const setFresnelIntensity = useCallback((intensity: number) => { 
    sceneDispatch({ type: "set", fresnel: { intensity } })
  }, [sceneDispatch])
  
  return (
    <div className="horizontal-color-setting">
      <Checkbox 
        label="Fresnel Effect"
        value={scene.fresnel.enabled}
        onChange={toggleFresnel}
        color={pallette.getNextColor()}
      />
      <ColorPortal label="Fresnel" color={scene.fresnel.color}>
        <ColorPicker
          value={scene.fresnel.color}
          onChange={setFresnelColor}
        />
        <Slider
          label={`Intensity: ${scene.fresnel.intensity.toFixed(2)}`}
          min={0}
          max={1.0}
          onChange={setFresnelIntensity}
          value={scene.fresnel.intensity}
          defaultValue={0.5}
          color={pallette.getNextColor()}
        />
      </ColorPortal>
    </div>
  )
}
