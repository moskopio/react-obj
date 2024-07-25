import { ReactElement } from "react"
import { Checkbox } from "./Checkbox"
import "./ControlsPanel.css"
import { Slider } from "./Slider"
import { FileInput } from "./FileInput"
import { loadObj } from "../utils/load-obj"

export function ControlsPanel(): ReactElement {  
  
  const onObjLoad = (obj: string) => {
    const data = loadObj(obj) 
    
    console.log(data)
  }
  
  return (
    <div className="controls-panel" > 
      <Checkbox label="Test" value={true} onChange={() => null} />
      <Slider label="Test 2" max={50} min={0} onChange={() => null} value={25} width={145} />
      <FileInput label="Load obj file..." onFileLoad={onObjLoad} />
    </div>
  )
}
