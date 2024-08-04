import { ChangeEvent, ReactElement, useCallback, useContext } from "react"
import { readObj } from "../obj/read"
import { AppContext } from "../state/context"
import "./ControlsPanel.css"
import { FileInput } from "./FileInput"
import { Slider } from "./Slider"
import { Checkbox } from "./Checkbox"

export function ControlsPanel(): ReactElement {
  const { camera, cameraDispatch, settings, settingsDispatch } = useContext(AppContext)
  
  const onFile = useObjLoad()
  
  const toggleMesh = useCallback(() => {
    settingsDispatch({ type: 'toggleMesh' })
  }, [settingsDispatch])
  
  const toggleWireframe = useCallback(() => {
    settingsDispatch({ type: 'toggleWireframe' })
  }, [settingsDispatch])
  
  const toggleOutline = useCallback(() => {
    settingsDispatch({ type: 'toggleOutline' })
  }, [settingsDispatch])
  
  const updateXRotation = useCallback((a: number) => { 
    cameraDispatch({ type: 'setXRotation', rotation: [a, 0, 0] })
  }, [cameraDispatch])
  
  const updateYRotation = useCallback((a: number) => { 
    cameraDispatch({ type: 'setYRotation', rotation: [0, a, 0] })
  }, [cameraDispatch])
  
  const updateZPosition = useCallback((v: number) => {
    cameraDispatch({ type: 'setZPosition', position: [0, 0, v] })
  }, [cameraDispatch])
  
  
  return (
    <div className="controls-panel" >
      <FileInput label="Load obj file..." onFile={onFile} />
      <Checkbox 
        label="Show Mesh"
        value={settings.showMesh}
        onChange={toggleMesh}
      />
      <Checkbox 
        label="Show Outline"
        value={settings.showOutline}
        onChange={toggleOutline}
      />
      <Checkbox 
        label="Show Wireframe"
        value={settings.showWireframe}
        onChange={toggleWireframe}
      />
      
      <Slider
        label={`X Axis: ${Math.floor(camera.rotation[0])}°`}
        min={-360}
        max={360}
        onChange={updateXRotation}
        value={camera.rotation[0]}
        defaultValue={0}
      />
      <Slider
        label={`Y Axis: ${Math.floor(camera.rotation[1])}°`}
        min={-360} 
        max={360} 
        onChange={updateYRotation}
        value={camera.rotation[1]}
        defaultValue={0}
      />
      <Slider
        label={`Distance ${camera.position[2].toFixed(2)}`} 
        min={0}
        max={10}
        onChange={updateZPosition}
        defaultValue={2.5}
        value={camera.position[2]}
        />
    </div>
  )
}

function useObjLoad(): (event: ChangeEvent<HTMLInputElement>) => void {
  const { setObj } = useContext(AppContext)
  
  const onObjLoad = useCallback((data: string) => {
    setObj(readObj(data))
  }, [setObj])
  
  return useCallback((event: ChangeEvent<HTMLInputElement>) => {
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
}
