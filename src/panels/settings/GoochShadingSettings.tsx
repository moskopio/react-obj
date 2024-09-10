import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "src/components/Checkbox"
import { ColorPicker } from "src/components/ColorPicker"
import { Divider } from "src/components/Divider"
import { SettingsPortal } from "src/components/SettingsPortal"
import { AppContext } from "src/state/context"
import { Color, createPallette } from "src/utils/color"


export function GoochShadingSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { shading } = settings
  const pallette = createPallette(5)
  
  const setEnabled = useCallback(
    (enabled: boolean) => settingsDispatch({ shading: { gooch: { enabled } }}), 
    [settingsDispatch])
    
  return (
    <Fragment>
      <div className="horizontal-setting">
        <Checkbox 
          label="Gooch Shading"
          value={shading.gooch.enabled}
          onChange={setEnabled}
          color={pallette.getNextColor()}
        />
        <SettingsPortal label="Gooch Shading">
          <ColorControls />
        </SettingsPortal>
      </div>
    </Fragment>
  )
}

function ColorControls(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { shading } = settings
  const pallette = createPallette(6)
  
  const setUseLight = useCallback(
    (useLight: boolean) => settingsDispatch({ shading: { gooch: { useLight } }}), 
    [settingsDispatch])
    
  const setWarm = useCallback(
    (warmColor: Color) => settingsDispatch({ shading: { gooch: { warmColor } } }), 
    [settingsDispatch])
    
  const setCool = useCallback(
      (coolColor: Color) => settingsDispatch({ shading: { gooch: { coolColor } } }), 
      [settingsDispatch])
    
  return (
    <Fragment>
      <Checkbox 
        label="Use Light Colors"
        value={shading.gooch.useLight}
        onChange={setUseLight}
        color={pallette.getNextColor()}
      />
      <Divider label="Warm" />
      <ColorPicker value={shading.gooch.warmColor} onChange={setWarm} />
      <Divider label="Cool" />
      <ColorPicker value={shading.gooch.coolColor} onChange={setCool} />
    </Fragment>
  )
}
