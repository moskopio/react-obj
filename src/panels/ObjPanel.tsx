import { ReactElement, useCallback, useContext, useRef } from "react"
import { Divider } from "../components/Divider"
import { IconFile } from "../components/Icon"
import { Panel } from "../components/Panel"
import { ObjContext } from "../state/obj"
import { useObjLoad } from "../utils/obj-load"
import './ObjPanel.css'
import { PASTEL_COLORS } from "../utils/color"


export function ObjPanel(): ReactElement {
  const { obj } = useContext(ObjContext)
  
  const groupsCount = obj.raw.groups.length
  const trianglesCount = obj.parsed.vertices.length
  const flatTrianglesCount = obj.flat.vertices.length
  const definedNormalsCount = obj.parsed.definedNormals.length
  const indicesCount = obj.parsed.indices.length
  const parsingTime = obj.parsingTime

  return (
    <Panel icon='info' color={PASTEL_COLORS.rainee}>
      <File />
      <Divider />
      <Stat label='Groups' value={groupsCount} />
      <Stat label='Vertices (defined)' value={trianglesCount} />
      <Stat label='Vertices (displayed)' value={flatTrianglesCount} />
      <Stat label='Triangles' value={flatTrianglesCount / 3} />
      <Stat label='Defined Normals' value={definedNormalsCount} />
      <Stat label='Indices' value={indicesCount} />
      <Divider />
      <Stat label='Parsing Time' value={`${parsingTime}ms`} />
    </Panel>
  )
}

function File(): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)
  const { obj } = useContext(ObjContext)
  const onFile = useObjLoad()

  const onClick = useCallback(() => {
    inputRef.current?.click()
  }, [])
  
  return (
    <div className="file-input" onClick={onClick}>
      <IconFile />
      <input ref={inputRef} type="file" onChange={onFile} accept=".obj" />
      <div className="file-input-label">{obj.name || "Load obj file..."}</div>
    </div>
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
