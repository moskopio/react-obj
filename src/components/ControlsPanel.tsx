import { ChangeEvent, ReactElement, useCallback, useContext } from "react"
import { AppContext } from "../state"
import { parseObj } from "../utils/obj/parse"
import { Checkbox } from "./Checkbox"
import "./ControlsPanel.css"
import { FileInput } from "./FileInput"
import { Slider } from "./Slider"

export function ControlsPanel(): ReactElement {  
  const { setObj, rotation, setRotation, distance, setDistance } = useContext(AppContext)
  
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
  
  const onObjLoad = useCallback((data: string) => {
    setObj(parseObj(data))
  }, [setObj])
  
  const updateXRotation = useCallback((a: number) => setRotation(r => [a, r[1], r[2]]), [setRotation])
  const updateYRotation = useCallback((a: number) => setRotation(r => [r[0], a, r[2]]), [setRotation])
  
  return (
    <div className="controls-panel" > 
      <FileInput label="Load obj file..." onFile={onFile} />
      <Checkbox label="Test" value={true} onChange={() => null} />
      <Slider 
        label={`X: ${Math.floor(rotation[0])}°`}
        min={0} 
        max={360} 
        onChange={updateXRotation} 
        value={rotation[0]}
        defaultValue={0}
         />
      <Slider 
        label={`Y: ${Math.floor(rotation[1])}°`}
        min={0} 
        max={360} 
        onChange={updateYRotation} 
        value={rotation[1]} 
        defaultValue={0}
        />
      <Slider 
        label={`Distance ${distance.toFixed(2)}`} 
          min={0}
          max={10}
          onChange={setDistance} 
          defaultValue={2.5}
          value={distance} 
        />
    </div>
  )
}
