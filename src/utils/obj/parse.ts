import { Vec2, Vec3 } from "../v3"
import { Group, Obj } from "./types"


export function parseObj(data: string): Obj {
  const groups: Group[] = [createGroup('obj')]
  let noGroups = true

  const lines = data.split('\n').filter(onlyMeaningfulLines)
  lines.forEach(parseLine)
  
  return { groups }
  
  function parseLine(line: string): void {
    let g = groups[groups.length -1]
    const parts = line.split((/\s+/))
    
    switch (parts[0]) {
      case 'g':
        const name = parts.slice(1).join(' ')
        if (noGroups) {
          g.name = name
          noGroups = false
        } else {
          g = createGroup(name)
          groups.push(g)
        }
        break
      case 'v': 
        g.vertices.push([parts[1], parts[2], parts[3]].map(parseFloat) as Vec3)
        break
      case 'vn': 
        g.normals.push([parts[1], parts[2], parts[3]].map(parseFloat) as Vec3)
        break
      case 'vt':
        g.uvs.push([parts[1], parts[2]].map(parseFloat) as Vec2)
        break
      case 'f':
        parseFace(g, parts)
        break
    }
  }
}

function onlyMeaningfulLines(line: string): boolean {
  return line[0] === 'v' || line[0] === 'f' || line[0] === 'g'
} 

function createGroup(name: string): Group {
  const faces:    Face[] = []
  const vertices: Vec3[] = []
  const normals:  Vec3[] = []
  const uvs:      Vec2[] = []
  
  return { name, faces, vertices, normals, uvs }
}

function parseFace(g: Group, parts: string[]): void {
  const vIndices:  number[] = []
  const nIndices:  number[] = []
  const uvIndices: number[] = []
  
  const face = parts.filter(p => p !== 'f')
  face.forEach(p => {
    const indices = p.split('/')
    vIndices.push(parseInt(indices[0]) - 1)
    indices[1] && uvIndices.push(parseInt(indices[1]) - 1)
    indices[2] && nIndices.push(parseInt(indices[2]) - 1)
  })
  
  g.faces.push( { vIndices, nIndices, uvIndices} )
}


