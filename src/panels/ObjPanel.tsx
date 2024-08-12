import { ReactElement, useContext } from "react"
import { Divider } from "../components/Divider"
import { FileInput } from "../components/FileInput"
import { Panel } from "../components/Panel"
import { ObjContext } from "../state/obj"
import { useObjLoad } from "../utils/obj-load"
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
    <Panel icon='info'>
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
