import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "../../components/Checkbox"
import { ColorPicker } from "../../components/ColorPicker"
import { Divider } from "../../components/Divider"
import { SettingsPortal } from "../../components/SettingsPortal"
import { AppContext } from "../../state/context"
import { Color, createPallette } from "../../utils/color"


export function GoochShadingSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { shading } = settings
  const pallette = createPallette(5)
  
  const setEnabled = useCallback(
    (enabled: boolean) => settingsDispatch({ shading: { gooch: { enabled } }}), 
    [settingsDispatch])
    
  return (
    <Fragment>
      <div className='horizontal-setting'> 
        <Checkbox 
          label="Gooch Shading"
          value={shading.gooch.enabled}
          onChange={setEnabled}
          color={pallette.getNextColor()}
        />
        <SettingsPortal label='Gooch Shading'>
          <ColorControls />
        </SettingsPortal>
      </div>
    </Fragment>
  )
}

function ColorControls(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { shading } = settings
  
  const setWarm = useCallback(
    (warmColor: Color) => settingsDispatch({ shading: { gooch: { warmColor } } }), 
    [settingsDispatch])
    
  const setCool = useCallback(
      (coolColor: Color) => settingsDispatch({ shading: { gooch: { coolColor } } }), 
      [settingsDispatch])
    
  return (
    <Fragment>
      <Divider label="Warm" />
      <ColorPicker value={shading.gooch.warmColor} onChange={setWarm} />
      <Divider label="Cool" />
      <ColorPicker value={shading.gooch.coolColor} onChange={setCool} />
    </Fragment>
  )
}
