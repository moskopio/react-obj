import { ChangeEvent, ReactElement, useCallback, useContext } from "react"
import { readObj } from "../obj/read"
import { AppContext } from "../state"
import "./ControlsPanel.css"
import { FileInput } from "./FileInput"
import { Slider } from "./Slider"

export function ControlsPanel(): ReactElement {
  const { setObj, rotation, setRotation, position, setPosition } = useContext(AppContext)
  
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
    setObj(readObj(data))
  }, [setObj])
  
  const updateXRotation = useCallback((a: number) => setRotation(r => [a, r[1], r[2]]), [setRotation])
  const updateYRotation = useCallback((a: number) => setRotation(r => [r[0], a, r[2]]), [setRotation])
  
  const updateZPosition = useCallback((v: number) => setPosition(p => [p[0], p[1], v]), [setPosition])
  
  
  return (
    <div className="controls-panel" >
      <FileInput label="Load obj file..." onFile={onFile} />
      <Slider
        label={`X Axis: ${Math.floor(rotation[0])}°`}
        min={-360}
        max={360}
        onChange={updateXRotation}
        value={rotation[0]}
        defaultValue={0}
      />
      <Slider
        label={`Y Axis: ${Math.floor(rotation[1])}°`}
        min={-360} 
        max={360} 
        onChange={updateYRotation}
        value={rotation[1]}
        defaultValue={0}
      />
      <Slider
        label={`Distance ${position[2].toFixed(2)}`} 
          min={-10}
          max={10}
          onChange={updateZPosition}
          defaultValue={2.5}
          value={position[2]}
        />
    </div>
  )
}
