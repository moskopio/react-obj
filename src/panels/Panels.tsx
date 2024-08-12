import { ReactElement } from "react"
import { CameraPanel } from "./CameraPanel"
import { FileInputControls } from "./FileInput"
import { ObjPanel } from "./ObjPanel"
import './Panels.css'
import { SettingsPanel } from "./SettingsPanel"

export function Panels(): ReactElement {
  

  
  return (
    <div className="panels">
      <FileInputControls />
      <ObjPanel />
      <SettingsPanel />
      <CameraPanel />
    </div>
  )
}

