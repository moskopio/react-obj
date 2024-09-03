import { ReactElement, useContext } from "react"
import { Checkbox } from "../components/Checkbox"
import { Divider } from "../components/Divider"
import { Panel } from "../components/Panel"
import { AppContext } from "../state/context"
import { createPallette, PASTEL_COLORS } from "../utils/color"
import './SettingsPanel.css'
import { GridSettings } from "./settings/GridSettings"
import { OutlineSettings } from "./settings/OutlineSettings"
import { CellShadingSettings } from "./settings/CellShadingSettings"

export function SettingsPanel(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const pallette = createPallette()

  return (
    <Panel icon='settings' color={PASTEL_COLORS.hai}>
      <Divider label='Mesh' />
      
      <Checkbox 
        label="Show Mesh"
        value={settings.showMesh}
        onChange={(showMesh: boolean) => settingsDispatch({ showMesh })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Swap Y/Z"
        value={settings.swapYZ}
        onChange={(swapYZ: boolean) => settingsDispatch({ swapYZ })}
        color={pallette.getNextColor()}
      />
      
      <CellShadingSettings />
      <Checkbox 
        label="Use Gooch Shading"
        value={settings.shading.gooch.enabled}
        onChange={(enabled: boolean) => settingsDispatch({ shading: { gooch: { enabled } }})}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Wireframe"
        value={settings.showWireframe}
        onChange={(showWireframe: boolean) => settingsDispatch({ showWireframe })}
        color={pallette.getNextColor()}
      />
      
      <Divider label="Normals" />
      
      <Checkbox 
        label="Show Normals"
        value={settings.shading.normal.enabled}
        onChange={(enabled: boolean) => settingsDispatch({ shading: { normal: { enabled } } })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Use Abs"
        value={settings.shading.normal.useAbs}
        onChange={(useAbs: boolean) => settingsDispatch({ shading: { normal: { useAbs } } })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Use flat Normals"
        value={settings.normals.useFlat}
        onChange={(useFlat: boolean) => settingsDispatch({ normals: { useFlat } })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Use defined Normals"
        value={settings.normals.useDefined}
        onChange={(useDefined: boolean) => settingsDispatch({ normals: { useDefined } })}
        color={pallette.getNextColor()}
      />
      
      < OutlineSettings />
      
      <Divider label="Stage" />
      <GridSettings />
      
    </Panel>
  )
}

