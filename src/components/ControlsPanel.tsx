import { ChangeEvent, ReactElement, useCallback, useContext } from "react"
import { readObj } from "../obj/read"
import { AppContext } from "../state/context"
import { FileInput } from "./basic/FileInput"
import { Slider } from "./basic/Slider"
import { Checkbox } from "./basic/Checkbox"
import { Panel } from "./basic/Panel"
import { Divider } from "./basic/Divider"
import { ObjContext } from "../state/obj"
import { parseObj } from "../obj/parse"
import { flattenParsedObj } from "../obj/flatten"
import { wireframeFlattenObj } from "../obj/wireframe"

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
    <Panel>
      <FileInput label="Load obj file..." onFile={onFile} />
      <Divider />
      
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
      <Divider />
      
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
    </Panel>
  )
}

function useObjLoad(): (event: ChangeEvent<HTMLInputElement>) => void {
  const { setObj } = useContext(ObjContext)
  
  const onObjLoad = useCallback((data: string) => {
    const tick = Date.now()
    const raw = readObj(data)
    const parsed = parseObj(raw)
    const flat = flattenParsedObj(parsed)
    const wireframe = wireframeFlattenObj(flat)
    const parsingTime = Date.now() - tick
    
    setObj({ raw, parsed, flat, wireframe, parsingTime })
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
