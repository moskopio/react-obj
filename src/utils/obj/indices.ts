import { RawObj } from "./read"

export function getVerticesIndices(obj: RawObj): number[] {
  const verticesIndices: number[] = []
  const { groups } = obj
  groups.forEach(g => g.faces.forEach(f => {
    const trianglesCount = f.vIndices.length - 2
    
    for (let i = 0; i < trianglesCount; ++i) {
      verticesIndices.push(f.vIndices[0])
      verticesIndices.push(f.vIndices[i + 1])
      verticesIndices.push(f.vIndices[i + 2])
    }
  }))
  return verticesIndices
}

export function getNormalIndices(obj: RawObj): number[] {
  const nIndices: number[] = []
  const { groups } = obj
  groups.forEach(g => g.faces.forEach(f => {
    const normalsCount = f.nIndices.length - 2
    
    for (let i = 0; i < normalsCount; ++i) {
      nIndices.push(f.nIndices[0])
      nIndices.push(f.nIndices[i + 1])
      nIndices.push(f.nIndices[i + 2])
    }
  }))
  return nIndices
}
