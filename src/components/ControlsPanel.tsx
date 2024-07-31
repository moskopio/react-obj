import { ChangeEvent, ReactElement, useCallback, useContext } from "react"
import { StateContext } from "../state"
import { parseObj } from "../utils/obj/parse"
import { Checkbox } from "./Checkbox"
import "./ControlsPanel.css"
import { FileInput } from "./FileInput"
import { Slider } from "./Slider"

export function ControlsPanel(): ReactElement {  
  
  const { setObj, rotation, setRotation, distance, setDistance } = useContext(StateContext)
  
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
  
  const updateXRotation = useCallback((angle: number) => { setRotation([angle, rotation[1], rotation[2]])}, [rotation, setRotation])
  const updateYRotation = useCallback((angle: number) => { setRotation([rotation[0], angle, rotation[2]])}, [rotation, setRotation])
  
  return (
    <div className="controls-panel" > 
      <FileInput label="Load obj file..." onFile={onFile} />
      <Checkbox label="Test" value={true} onChange={() => null} />
      <Slider label={`X: ${Math.floor(rotation[0])}`} max={360} min={0} onChange={updateXRotation} value={rotation[0]} width={145} />
      <Slider label={`Y: ${Math.floor(rotation[1])}`}  max={360} min={0} onChange={updateYRotation} value={rotation[1]} width={145} />
      <Slider label={`Distance ${Math.floor(distance)}`} max={100} min={0} onChange={setDistance} value={distance} width={145} />
    </div>
  )
}
