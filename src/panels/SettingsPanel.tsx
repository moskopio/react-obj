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
        label="Show Outline"
        value={settings.showOutline}
        onChange={() => settingsDispatch({ type: 'toggleOutline' })}
      />
      <Checkbox 
        label="Show Wireframe"
        value={settings.showWireframe}
        onChange={() => settingsDispatch({ type: 'toggleWireframe' })}
      />
      
      <Checkbox 
        label="Swap Y/Z"
        value={settings.swapYZ}
        onChange={() => settingsDispatch({ type: 'toggleSwapYZ' })}
      />
    </Panel>
  )
}

