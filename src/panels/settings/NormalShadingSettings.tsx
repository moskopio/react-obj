import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "../../components/Checkbox"
import { SettingsPortal } from "../../components/SettingsPortal"
import { AppContext } from "../../state/context"
import { createPallette } from "../../utils/color"

export function NormalShadingSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { shading } = settings
  const { normal } = shading
  
  const pallette = createPallette(0)
  
  const toggleEnabled = useCallback(
    (enabled: boolean) => settingsDispatch({ shading: { normal: { enabled } } }), 
    [settingsDispatch])
    
  const toggleAbs = useCallback(
    (useAbs: boolean) => settingsDispatch({ shading: { normal: { useAbs } } }), 
    [settingsDispatch])
    
  return (
    <Fragment>
      <div className="horizontal-setting">
        <Checkbox 
            label="Display Normals"
            value={normal.enabled}
            onChange={toggleEnabled}
            color={pallette.getNextColor()}
          />
        <SettingsPortal label="Normals Preview">
        <Checkbox 
            label="Use ABS values"
            value={normal.useAbs}
            onChange={toggleAbs}
            color={pallette.getNextColor()}
          />
        </SettingsPortal>
      </div>
    </Fragment>
  )
}
