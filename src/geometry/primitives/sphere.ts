import { Primitive } from "./types"
import { V3, Vec2, Vec3 } from "src/math/v3"

// One vertex at every latitude-longitude intersection,
// plus one for the north pole and one for the south.
// One meridian serves as a UV seam, so we double the vertices there.
export function createSphere(numLatitudeLines: number, numLongitudeLines: number): Primitive {
  const points:        Vec3[] = []
  const pointsUVs:     Vec2[] = []
  const pointsNormals: Vec3[] = []
  
  // North Pole
  points.push([0, 1, 0])
  pointsUVs.push([0, 1])
  pointsNormals.push([0, 1, 0])
  
  // +1.0f because there's a gap between the poles and the first parallel.
  const latitudeSpacing = 1 / (numLatitudeLines + 1)
  const longitudeSpacing = 1 / (numLongitudeLines)
  
  for(let latitude = 0; latitude < numLatitudeLines; latitude++) {
    for(let longitude = 0; longitude <= numLongitudeLines; longitude++) {
      
      // Scale coordinates into the 0...1 texture coordinate range,
      // with north at the top (y = 1).
      const uv = [longitude * longitudeSpacing, 1 - (latitude + 1) * latitudeSpacing] as Vec2
      pointsUVs.push(uv)
      
      // Convert to spherical coordinates:
      // theta is a longitude angle (around the equator) in radians.
      // phi is a latitude angle (north or south of the equator).
      const theta = uv[0] * 2 * Math.PI
      const phi = (uv[1] - 0.5) * Math.PI
      
      // This determines the radius of the ring of this line of latitude.
      // It's widest at the equator, and narrows as phi increases/decreases.
      const c = Math.cos(phi)
  
      const point = [c * Math.cos(theta), Math.sin(phi),  c * Math.sin(theta)] as Vec3
      points.push(point)
      pointsNormals.push(V3.normalize(point))
    }
  }
  
  // South Pole
  points.push([0, -1, 0])
  pointsUVs.push([0, 0])
  pointsNormals.push([0, -1, 0])
  
  
  const vertices:        Vec3[] = []
  const uvs:     Vec2[] = []
  const normals: Vec3[] = []
  
  // Triangle at North Pole
  for (let i = 0; i < numLongitudeLines; i++) {
    vertices.push(points[0])
    vertices.push(points[i + 2])
    vertices.push(points[i + 1])
    
    uvs.push(pointsUVs[0])
    uvs.push(pointsUVs[i + 2])
    uvs.push(pointsUVs[i + 1])
    
    normals.push(pointsNormals[0])
    normals.push(pointsNormals[i + 2])
    normals.push(pointsNormals[i + 1])
  }
  
  // Each row has one more unique vertex than there are lines of longitude,
  // since we double a vertex at the texture seam.
  const rowLength = numLongitudeLines +1
  for (let latitude = 0; latitude < numLatitudeLines - 1; latitude++) {
    // Plus one for the pole.
    const rowStart = latitude * rowLength + 1
    for (let longitude = 0; longitude < numLongitudeLines; longitude++) {
        const firstCorner = rowStart + longitude

        // First triangle of quad: Top-Left, Bottom-Left, Bottom-Right
        vertices.push(points[firstCorner])
        vertices.push(points[firstCorner + rowLength + 1])
        vertices.push(points[firstCorner + rowLength])
        
        uvs.push(pointsUVs[firstCorner])
        uvs.push(pointsUVs[firstCorner + rowLength + 1])
        uvs.push(pointsUVs[firstCorner + rowLength])
        
        normals.push(pointsNormals[firstCorner])
        normals.push(pointsNormals[firstCorner + rowLength + 1])
        normals.push(pointsNormals[firstCorner + rowLength])

        // Second triangle of quad: Top-Left, Bottom-Right, Top-Right
        vertices.push(points[firstCorner])
        vertices.push(points[firstCorner + 1])
        vertices.push(points[firstCorner + rowLength + 1])
        
        uvs.push(pointsUVs[firstCorner])
        uvs.push(pointsUVs[firstCorner + 1])
        uvs.push(pointsUVs[firstCorner + rowLength + 1])
        
        normals.push(pointsNormals[firstCorner])
        normals.push(pointsNormals[firstCorner + 1])
        normals.push(pointsNormals[firstCorner + rowLength + 1])
    }
  }
  
  const southPole = points.length - 1
  const bottomRow = (numLatitudeLines - 1) * rowLength + 1

  for (let i = 0; i < numLongitudeLines; i++) {
      vertices.push(points[southPole])
      vertices.push(points[bottomRow + i])
      vertices.push(points[bottomRow + i + 1])
      
      uvs.push(pointsUVs[southPole])
      uvs.push(pointsUVs[bottomRow + i])
      uvs.push(pointsUVs[bottomRow + i + 1])
      
      normals.push(pointsNormals[southPole])
      normals.push(pointsNormals[bottomRow + i])
      normals.push(pointsNormals[bottomRow + i + 1])
  }
  
  return { vertices, normals, uvs }
}
