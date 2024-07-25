interface Object {
  vertex:       number[]
  normal:       number[]
  texture:      number[]
  vertexIndex:  number[]
  normalIndex:  number[]
  textureIndex: number[]
}

type vec3 = [number, number, number]
type vec2 = [number, number] 


function sub(a: vec3, b: vec3): vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function cross(a: vec3, b: vec3): vec3 {
  const x = a[1] * b[2] - a[2] * b[1]
  const y = a[2] * b[0] - a[0] * b[2]
  const z = a[0] * b[1] - a[1] * b[0]
  return [x, y, z]
}

function magnitude(a: vec3): number {
  return Math.hypot(...a) 
}

function normalize(a: vec3): vec3 {
  const mag = magnitude(a)
  return mag ? [a[0] / mag, a[1] /mag, a[2] / mag] : [0, 0, 0]
}


export function loadObj(obj: string): Object {  
  const v: vec3[] = []
  const n: vec3[] = []
  const t: vec2[] = []
  const vi: number[] = []
  const ni: number[] = []
  const ti: number[] = []

  parseObj(obj)  
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
  
  function parseObj(obj: string): void {
    const lines = obj.split('\n')
    lines.map(line => line.trim()).filter(filterCommentsAndEmpty).forEach(parseLine)
  }
  
  function filterCommentsAndEmpty(line: string): boolean {
    return line[0] === 'v' || line[0] === 'f' || line[0] === 'g'
  }
  
  // v  - vertex (vec3)
  // vn - vertex normal (vec3)
  // vt - texture coordinates (vec2)
  // f - face (indices vi/ni/ti)
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
      ni.push(parseInt((indices[1] ? indices[1] : indices[0])) - 1)
      ti.push(parseInt((indices[2] ? indices[2] : indices[0])) - 1)
    })
  }
  
  function calculateNormals(): void {
    for (let i=0; i < ni.length; i = i + 3) {
      const v0 = v[ni[i]]
      const v1 = v[ni[i + 1]]
      const v2 = v[ni[i + 2]]
      
      const a = sub(v1, v0)
      const b = sub(v2, v1)
      n.push(normalize(cross(a, b)))
    }
  
  }
}
