import { ReactElement, useContext } from "react"
import { ObjContext } from "../state/obj"
import { Panel } from "./basic/Panel"
import './StatisticsPanel.css'
import { Divider } from "./basic/Divider"

export function StatisticsPanel(): ReactElement {
  const { obj } = useContext(ObjContext)
   
  const groupsCount = obj.raw.groups.length
  const trianglesCount = obj.parsed.vertices.length
  const definedNormalsCount = obj.parsed.definedNormals.length
  const parsingTime = obj.parsingTime
  
  return (
    <Panel>
      <Stat label='Groups' value={groupsCount} />
      <Stat label='Triangles' value={trianglesCount} />
      <Stat label='Defined Normals' value={definedNormalsCount} />
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
