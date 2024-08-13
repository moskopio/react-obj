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
        onChange={() => settingsDispatch({ type: 'toggleMesh' })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Normals"
        value={settings.showNormals}
        onChange={() => settingsDispatch({ type: 'toggleNormals' })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Flat Normals"
        value={settings.flatNormals}
        onChange={() => settingsDispatch({ type: 'toggleFlatNormals' })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Cell Shading"
        value={settings.cellShading}
        onChange={() => settingsDispatch({ type: 'toggleCellShading' })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Outline"
        value={settings.showOutline}
        onChange={() => settingsDispatch({ type: 'toggleOutline' })}
        color='#707e7d'
      />
      
      <Checkbox 
        label="Show Reverse Outline"
        value={settings.showReverseOutline}
        onChange={() => settingsDispatch({ type: 'toggleReverseOutline' })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Show Wireframe"
        value={settings.showWireframe}
        onChange={() => settingsDispatch({ type: 'toggleWireframe' })}
        color={pallette.getNextColor()}
      />
      
      
      <Checkbox 
        label="Show Grid"
        value={settings.showGrid}
        onChange={() => settingsDispatch({ type: 'toggleGrid' })}
        color={pallette.getNextColor()}
      />
      
      <Checkbox 
        label="Swap Y/Z"
        value={settings.swapYZ}
        onChange={() => settingsDispatch({ type: 'toggleSwapYZ' })}
        color={pallette.getNextColor()}
      />
      
    </Panel>
  )
}

