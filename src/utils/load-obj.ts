import { Obj } from "../types"
import { V3, Vec2, Vec3 } from "./v3"

export function loadObj(data: string): Obj {  
  const v: Vec3[] = []
  const n: Vec3[] = []
  const t: Vec2[] = []
  const vi: number[] = []
  const ni: number[] = []
  const ti: number[] = []

  parseData(data)
  if (n.length === 0) {
    calculateNormals()
  }
  
  return { 
    vertex: v.flatMap(v => v), 
    normal: n.flatMap(n => n), 
    texture: t.flatMap(t => t),
    vertexIndex: vi,
    normalIndex: ni,
    textureIndex: ti
  }
  
  function parseData(data: string): void {
    const lines = data.split('\n')
    lines.map(line => line.trim()).filter(filterCommentsAndEmpty).forEach(parseLine)
  }
  
  function filterCommentsAndEmpty(line: string): boolean {
    return line[0] === 'v' || line[0] === 'f' || line[0] === 'g'
  }
  
  // v  - vertex (vec3)
  // vn - vertex normal (vec3)
  // vt - texture coordinates (vec2)
  // f - face (indices vi/ti/ni)
  // g - group (text description?)
  function parseLine(line: string): void {
    const parts = line.split((/\s+/))
    
    switch (parts[0]) {
      case 'v': 
        v.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])])
        break
      case 'vn': 
        n.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])])
        break
      case 'vt':
        t.push([parseFloat(parts[1]), parseFloat(parts[2])])
        break
      case 'f':
        // base on slashes, we need to determine how many indices face defines
        parseFace(parts)
        break
    }
  }
  
  function parseFace(face: string[]): void {
    face.filter(p => p !== 'f').forEach(p => {
      const indices = p.split('/')

      vi.push(parseInt(indices[0]) - 1)
      ti.push(parseInt((indices[1] ? indices[1] : indices[0])) - 1)
      ni.push(parseInt((indices[2] ? indices[2] : indices[0])) - 1)
    })
  }
  
  function calculateNormals(): void {
    for (let i=0; i < ni.length; i = i + 3) {
      const v0 = v[ni[i]]
      const v1 = v[ni[i + 1]]
      const v2 = v[ni[i + 2]]
      
      const a = V3.subtract(v1, v0)
      const b = V3.subtract(v2, v1)
      n.push(V3.normalize(V3.cross(a, b)))
    }
  
  }
}
