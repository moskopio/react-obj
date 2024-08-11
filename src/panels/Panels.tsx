import { ReactElement } from "react"
import { ObjPanel } from "./ObjPanel"
import { SettingsPanel } from "./SettingsPanel"
import { CameraPanel } from "./CameraPanel"
import './Panels.css'

export function Panels(): ReactElement {
  return (
    <div className="panels">
      <ObjPanel />
      <SettingsPanel />
      <CameraPanel />
    </div>
  )
}
