import { ChangeEvent, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "./Checkbox"
import "./ControlsPanel.css"
import { Slider } from "./Slider"
import { FileInput } from "./FileInput"
import { loadObj } from "../utils/load-obj"
import { StateContext } from "../state"

export function ControlsPanel(): ReactElement {  
  
  const { setObj } = useContext(StateContext)
  
  const onFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function(event: ProgressEvent<FileReader>) {
        const result = event?.target?.result
        
        if (typeof result === 'string') {
          onObjLoad(result)
        }
        
      }
      reader.readAsText(file)
    }
  }, [])
  
  const onObjLoad = useCallback((data: string) => setObj(loadObj(data)), [setObj])
  
  return (
    <div className="controls-panel" > 
      <Checkbox label="Test" value={true} onChange={() => null} />
      <Slider label="Test 2" max={50} min={0} onChange={() => null} value={25} width={145} />
      <FileInput label="Load obj file..." onFile={onFile} />
    </div>
  )
}
