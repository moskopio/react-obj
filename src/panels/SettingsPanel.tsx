import { ReactElement, useContext } from "react"
import { AppContext } from "../state/context"
import { Checkbox } from "../components/Checkbox"
import { Panel } from "../components/Panel"

export function SettingsPanel(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  
  return (
    <Panel icon='settings'>
      <Checkbox 
        label="Show Mesh"
        value={settings.showMesh}
        onChange={() => settingsDispatch({ type: 'toggleMesh' })}
      />
      
      <Checkbox 
        label="Show Normals"
        value={settings.showNormals}
        onChange={() => settingsDispatch({ type: 'toggleNormals' })}
      />
      
      <Checkbox 
        label="Flat Normals"
        value={settings.flatNormals}
        onChange={() => settingsDispatch({ type: 'toggleFlatNormals' })}
      />
      
      <Checkbox 
        label="Cell Shading"
        value={settings.cellShading}
        onChange={() => settingsDispatch({ type: 'toggleCellShading' })}
      />
      
      <Checkbox 
        label="Show Outline"
        value={settings.showOutline}
        onChange={() => settingsDispatch({ type: 'toggleOutline' })}
      />
      
      <Checkbox 
        label="Show Reverse Outline"
        value={settings.showReverseOutline}
        onChange={() => settingsDispatch({ type: 'toggleReverseOutline' })}
      />
      
      <Checkbox 
        label="Show Wireframe"
        value={settings.showWireframe}
        onChange={() => settingsDispatch({ type: 'toggleWireframe' })}
      />
      
      
      <Checkbox 
        label="Show Grid"
        value={settings.showGrid}
        onChange={() => settingsDispatch({ type: 'toggleGrid' })}
      />
      
      <Checkbox 
        label="Swap Y/Z"
        value={settings.swapYZ}
        onChange={() => settingsDispatch({ type: 'toggleSwapYZ' })}
      />
      
    </Panel>
  )
}

