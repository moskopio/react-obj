import { ReactElement, useContext } from "react"
import { Checkbox } from "src/components/Checkbox"
import { Divider } from "src/components/Divider"
import { Panel } from "src/components/Panel"
import { AppContext } from "src/state/context"
import { createPallette, PASTEL_COLORS } from "src/utils/color"
import "./SettingsPanel.css"
import { CellShadingSettings } from "./settings/CellShadingSettings"
import { GoochShadingSettings } from "./settings/GoochShadingSettings"
import { GridSettings } from "./settings/GridSettings"
import { NormalShadingSettings } from "./settings/NormalShadingSettings"
import { OutlineSettings } from "./settings/OutlineSettings"
import { PointsSettings } from "./settings/PointsSettings"
import { WireframeSettings } from "./settings/WireframeSettings"

export function SettingsPanel(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const pallette = createPallette()

  return (
    <Panel icon="settings" color={PASTEL_COLORS.hai}>
      <Divider label="Mesh" />
      
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
      
      <WireframeSettings />
      <PointsSettings />

      <Divider label="Shading" />
      
      <CellShadingSettings />
      <GoochShadingSettings />
      <NormalShadingSettings />
      
      <Divider label="Normals" />
      
      <Checkbox 
        label="Use flat"
        value={settings.normals.useFlat}
        onChange={(useFlat: boolean) => settingsDispatch({ normals: { useFlat } })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Use defined"
        value={settings.normals.useDefined}
        onChange={(useDefined: boolean) => settingsDispatch({ normals: { useDefined } })}
        color={pallette.getNextColor()}
      />
      
      <Divider label="Outline" />
      < OutlineSettings />
      
      <Divider label="Stage" />
      <GridSettings />
      
    </Panel>
  )
}

