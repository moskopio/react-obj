import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "../../components/Checkbox"
import { ColorPicker } from "../../components/ColorPicker"
import { SettingsPortal } from "../../components/SettingsPortal"
import { AppContext } from "../../state/context"
import { Color, createPallette } from "../../utils/color"

export function WireframeSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { wireframe } = settings
  
  const pallette = createPallette(7)
  
  const toggleEnabled = useCallback(
    (enabled: boolean) => settingsDispatch({ wireframe: { enabled } }), 
    [settingsDispatch])
  const toggleUseShading = useCallback(
    (useShading: boolean) => settingsDispatch({ wireframe: { useShading } }), 
    [settingsDispatch])
  const setColor = useCallback(
    (color: Color) => settingsDispatch({ wireframe: { color } }), 
    [settingsDispatch])
    
    
  return (
    <Fragment>
      <div className="horizontal-setting">
        <Checkbox 
          label="Show Wireframe"
          value={wireframe.enabled}
          onChange={toggleEnabled}
          color={pallette.getNextColor()}
        />
        <SettingsPortal label="Wireframe">
          <Checkbox 
            label="Use Shading"
            value={wireframe.useShading}
            onChange={toggleUseShading}
            color={pallette.getNextColor()}
          />
          <ColorPicker
            value={wireframe.color}
            onChange={setColor}
          />
        </SettingsPortal>
      </div>
    </Fragment>
  )
}
