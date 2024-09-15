import { Primitive } from "./types"
import { V3, Vec2, Vec3 } from "src/math/v3"


export function createSphere(latitudeLines: number, longitudeLines: number): Primitive {
  const vertices: Vec3[] = []
  const uvs:      Vec2[] = []
  const normals:  Vec3[] = []
  
  const points = createPointsSphere(latitudeLines, longitudeLines)
  
  createNorthPole()
  createSphereMiddle()
  createSouthPole()

  
  return { vertices, normals, uvs }
  
  function createNorthPole(): void {
    for (let i = 0; i < longitudeLines; i++) {
      vertices.push(points.vertices[0])
      vertices.push(points.vertices[i + 2])
      vertices.push(points.vertices[i + 1])
      
      uvs.push(points.uvs[0])
      uvs.push(points.uvs[i + 2])
      uvs.push(points.uvs[i + 1])
      
      normals.push(points.normals[0])
      normals.push(points.normals[i + 2])
      normals.push(points.normals[i + 1])
    }
  }
  
  function createSphereMiddle(): void {
    // Each row has one more unique vertex than there are lines of longitude,
    // since we double a vertex at the texture seam.
    const rowLength = longitudeLines + 1
    
    for (let latitude = 0; latitude < latitudeLines - 1; latitude++) {
      // Plus one for the pole.
      const rowStart = latitude * rowLength + 1
      for (let longitude = 0; longitude < longitudeLines; longitude++) {
        const firstCorner = rowStart + longitude

        // First triangle of quad: Top-Left, Bottom-Left, Bottom-Right
        vertices.push(points.vertices[firstCorner])
        vertices.push(points.vertices[firstCorner + rowLength + 1])
        vertices.push(points.vertices[firstCorner + rowLength])
        
        uvs.push(points.uvs[firstCorner])
        uvs.push(points.uvs[firstCorner + rowLength + 1])
        uvs.push(points.uvs[firstCorner + rowLength])
        
        normals.push(points.normals[firstCorner])
        normals.push(points.normals[firstCorner + rowLength + 1])
        normals.push(points.normals[firstCorner + rowLength])

        // Second triangle of quad: Top-Left, Bottom-Right, Top-Right
        vertices.push(points.vertices[firstCorner])
        vertices.push(points.vertices[firstCorner + 1])
        vertices.push(points.vertices[firstCorner + rowLength + 1])
        
        uvs.push(points.uvs[firstCorner])
        uvs.push(points.uvs[firstCorner + 1])
        uvs.push(points.uvs[firstCorner + rowLength + 1])
        
        normals.push(points.normals[firstCorner])
        normals.push(points.normals[firstCorner + 1])
        normals.push(points.normals[firstCorner + rowLength + 1])
      }
    }
  }
  
  function createSouthPole(): void {
    const rowLength = longitudeLines + 1
    const southPole = points.vertices.length - 1
    const bottomRow = (latitudeLines - 1) * rowLength + 1

    for (let i = 0; i < longitudeLines; i++) {
      vertices.push(points.vertices[southPole])
      vertices.push(points.vertices[bottomRow + i])
      vertices.push(points.vertices[bottomRow + i + 1])
      
      uvs.push(points.uvs[southPole])
      uvs.push(points.uvs[bottomRow + i])
      uvs.push(points.uvs[bottomRow + i + 1])
      
      normals.push(points.normals[southPole])
      normals.push(points.normals[bottomRow + i])
      normals.push(points.normals[bottomRow + i + 1])
    }
  }
}

/**
 * Create a primitive points sphere.
 * One vertex at every latitude-longitude intersection plus one for the north pole and one for the south.
 * One meridian serves as a UV seam, and creates double the vertices at that point.
 **/
function createPointsSphere(latitudeLines: number, longitudeLines: number): Primitive {
  const vertices: Vec3[] = []
  const uvs:      Vec2[] = []
  const normals:  Vec3[] = []

  // North Pole
  vertices.push([0, 1, 0])
  uvs.push([0, 1])
  normals.push([0, 1, 0])
  
  // +1.0f because there's a gap between the poles and the first parallel.
  const latitudeSpacing = 1 / (latitudeLines + 1)
  const longitudeSpacing = 1 / (longitudeLines)
  
  for(let latitude = 0; latitude < latitudeLines; latitude++) {
    for(let longitude = 0; longitude <= longitudeLines; longitude++) {
      // Scale coordinates into the 0...1 texture coordinate range,
      // with north at the top (y = 1).
      const uv = [longitude * longitudeSpacing, 1 - (latitude + 1) * latitudeSpacing] as Vec2
      uvs.push(uv)
      
      // Convert to spherical coordinates:
      // theta is a longitude angle (around the equator) in radians.
      // phi is a latitude angle (north or south of the equator).
      const theta = uv[0] * 2 * Math.PI
      const phi = (uv[1] - 0.5) * Math.PI
      
      // This determines the radius of the ring of this line of latitude.
      // It's widest at the equator, and narrows as phi increases/decreases.
      const c = Math.cos(phi)
  
      const point = [c * Math.cos(theta), Math.sin(phi),  c * Math.sin(theta)] as Vec3
      vertices.push(point)
      normals.push(V3.normalize(point))
    }
  }
  
  // South Pole
  vertices.push([0, -1, 0])
  uvs.push([0, 0])
  normals.push([0, -1, 0])
  
  return { vertices, uvs, normals }
}
