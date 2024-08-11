import { ChangeEvent, ReactElement, useCallback, useContext } from "react"
import { flattenParsedObj } from "../utils/obj/flatten"
import { parseObj } from "../utils/obj/parse"
import { readObj } from "../utils/obj/read"
import { wireframeFlattenObj } from "../utils/obj/wireframe"
import { ObjContext } from "../state/obj"
import { Divider } from "../components/Divider"
import { FileInput } from "../components/FileInput"
import { Panel } from "../components/Panel"
import './ObjPanel.css'


export function ObjPanel(): ReactElement {
  const { obj } = useContext(ObjContext)
  
  const onFile = useObjLoad()
  
  const groupsCount = obj.raw.groups.length
  const trianglesCount = obj.parsed.vertices.length
  const flatTrianglesCount = obj.flat.vertices.length
  const definedNormalsCount = obj.parsed.definedNormals.length
  const indicesCount = obj.parsed.indices.length
  const parsingTime = obj.parsingTime

  return (
    <Panel icon='file'>
      <FileInput label={obj.name || "Load obj file..."} onFile={onFile} />
      <Divider />
      <Stat label='Groups' value={groupsCount} />
      <Stat label='Triangles (defined)' value={trianglesCount} />
      <Stat label='Triangles (displayed)' value={flatTrianglesCount} />
      <Stat label='Defined Normals' value={definedNormalsCount} />
      <Stat label='Indices' value={indicesCount} />
      <Divider />
      <Stat label='Parsing Time' value={`${parsingTime}ms`} />
    </Panel>
  )
}

interface StatProps {
  label: string
  value: string | number
}

function Stat(props: StatProps): ReactElement {
  const {label, value } = props
  
  return (
    <div className="stat"> 
      <div className="stat-label">{label}: </div>
      <div className="stat-value">{value}</div>
    </div>
  )
}

function useObjLoad(): (event: ChangeEvent<HTMLInputElement>) => void {
  const { setObj } = useContext(ObjContext)
  
  const onObjLoad = useCallback((data: string, name: string) => {
    const tick = Date.now()
    const raw = readObj(data)
    const parsed = parseObj(raw)
    const flat = flattenParsedObj(parsed)
    const wireframe = wireframeFlattenObj(flat)
    const parsingTime = Date.now() - tick
    
    setObj({ name, raw, parsed, flat, wireframe, parsingTime })
  }, [setObj])
  
  return useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    
    if (file) {
      const reader = new FileReader()
      reader.onload = function(event: ProgressEvent<FileReader>) {
        const result = event?.target?.result
        
        if (typeof result === 'string') {
          onObjLoad(result, file.name)
        }
        
      }
      reader.readAsText(file)
    }
  }, [])
}
