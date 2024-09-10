import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "src/components/Checkbox"
import { SettingsPortal } from "src/components/SettingsPortal"
import { Slider } from "src/components/Slider"
import { AppContext } from "src/state/context"
import { createPallette } from "src/utils/color"

export function CellShadingSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { shading } = settings
  const { cell } = shading
  
  const pallette = createPallette(4)
  
  const toggleEnabled = useCallback(
    (enabled: boolean) => settingsDispatch({ shading: { cell: { enabled } } }), 
    [settingsDispatch])
    
  const setSegments = useCallback(
    (segments: number) => settingsDispatch({ shading: { cell: { segments: Math.floor(segments)} } }), 
    [settingsDispatch])
    
  const setAA = useCallback(
    (aa: number) => settingsDispatch({ shading: { cell: { aa } } }), 
    [settingsDispatch])
    
  return (
    <Fragment>
      <div className="horizontal-setting">
        <Checkbox 
            label="Cell Shading"
            value={cell.enabled}
            onChange={toggleEnabled}
            color={pallette.getNextColor()}
          />
        <SettingsPortal label="Cell Shading">
          <Slider 
            label={`Segments ${cell.segments}`}
            value={cell.segments}
            min={1}
            max={16}
            defaultValue={4}
            onChange={setSegments}
            color={pallette.getNextColor()}
          />
          <Slider 
            label={`AA ${cell.aa.toFixed(2)}`}
            value={cell.aa}
            min={0}
            max={1}
            defaultValue={0.01}
            onChange={setAA}
            color={pallette.getNextColor()}
          />
        </SettingsPortal>
      </div>
    </Fragment>
  )
}
