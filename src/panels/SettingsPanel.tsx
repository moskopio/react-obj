import { ReactElement, useContext } from "react"
import { Checkbox } from "../components/Checkbox"
import { Panel } from "../components/Panel"
import { AppContext } from "../state/context"
import { createPallette, PASTEL_COLORS } from "../utils/color"

export function SettingsPanel(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const pallette = createPallette()

  return (
    <Panel icon='settings' color={PASTEL_COLORS.hai}>
      <Checkbox 
        label="Show Mesh"
        value={settings.showMesh}
        onChange={(showMesh: boolean) => settingsDispatch({ showMesh })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Normals"
        value={settings.showNormals}
        onChange={(showNormals: boolean) => settingsDispatch({ showNormals })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Flat Normals"
        value={settings.flatNormals}
        onChange={(flatNormals: boolean) => settingsDispatch({ flatNormals })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Cell Shading"
        value={settings.cellShading}
        onChange={(cellShading: boolean) => settingsDispatch({ cellShading })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Outline"
        value={settings.showOutline}
        onChange={(showOutline: boolean) => settingsDispatch({ showOutline })}
        color='#707e7d'
      />
      
      <Checkbox 
        label="Show Reverse Outline"
        value={settings.showReverseOutline}
        onChange={(showReverseOutline: boolean) => settingsDispatch({ showReverseOutline })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Wireframe"
        value={settings.showWireframe}
        onChange={(showWireframe: boolean) => settingsDispatch({ showWireframe })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Grid"
        value={settings.showGrid}
        onChange={(showGrid: boolean) => settingsDispatch({ showGrid })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Swap Y/Z"
        value={settings.swapYZ}
        onChange={(swapYZ: boolean) => settingsDispatch({ swapYZ })}
        color={pallette.getNextColor()}
      />
      
    </Panel>
  )
}

