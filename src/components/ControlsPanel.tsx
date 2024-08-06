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
  
  const setThetaRotation = useCallback((a: number) => { 
    cameraDispatch({ type: 'setThetaRotation', rotation: { theta: a, phi: 0 }})
  }, [cameraDispatch])
  
  const setPhiRotation = useCallback((a: number) => { 
    cameraDispatch({ type: 'setPhiRotation', rotation: { theta: 0, phi: a }})
  }, [cameraDispatch])
  
  const updateXTrack = useCallback((v: number) => {
    cameraDispatch({ type: 'setXTrack', track: { x: v, y: 0 } })
  }, [cameraDispatch])
  
  const updateYTrack = useCallback((v: number) => {
    cameraDispatch({ type: 'setYTrack', track: { x: 0, y: v } })
  }, [cameraDispatch])
  
  const setDolly = useCallback((dolly: number) => {
    cameraDispatch({ type: 'setDolly', dolly })
  }, [cameraDispatch])
  
  
  
  
  return (
    <Panel>
      <FileInput label="Load obj file..." onFile={onFile} />
      <Divider />
      
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
      <Divider />
      
      <Slider
        label={`Theta: ${Math.floor(camera.rotation.theta)}°`}
        min={-360}
        max={360}
        onChange={setThetaRotation}
        value={camera.rotation.theta}
        defaultValue={0}
      />
      <Slider
        label={`Phi: ${Math.floor(camera.rotation.phi)}°`}
        min={-360} 
        max={360} 
        onChange={setPhiRotation}
        value={camera.rotation.phi}
        defaultValue={0}
      />
      
      <Divider />

      <Slider
        label={`Track X: ${camera.track.x.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateXTrack}
        defaultValue={0}
        value={camera.track.x}
        />
      <Slider
        label={`Track Y: ${camera.track.y.toFixed(2)}`} 
        min={-10}
        max={10}
        onChange={updateYTrack}
        defaultValue={0}
        value={camera.track.y}
        />
      <Slider
        label={`Dolly ${camera.dolly.toFixed(2)}`} 
        min={0}
        max={10}
        onChange={setDolly}
        defaultValue={2.5}
        value={camera.dolly}
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
