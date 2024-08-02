import { lookAt, perspective } from '../utils/camera'
import { M4 } from '../utils/m4'
import { flattenParsedObj } from '../utils/obj/flatten'
import { parseObj } from '../utils/obj/parse'
import { RawObj } from '../utils/obj/types'
import { degToQuaternion, quaternionToRotationMatrix } from '../utils/quaternion'
import { degToRad } from '../utils/util'
import { Vec3 } from '../utils/v3'
import { setupAttributes, updateAttributes } from '../webgl/attributes'
import { createShaderProgram } from '../webgl/program'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'
import { Dict } from './utils'

export interface MeshDrawer {
  setObj:         (obj: RawObj) => void
  updateCamera:   (rotation: Vec3, distance: number) => void
  updateSettings: (settings: Partial<Settings>) => void
  draw:           () => void
}

type Settings = Dict<number | string | boolean>

enum TYPE { 
  M4 = 1,
  V3 = 2,
  V4 = 3,
  Bool = 4,
}

const UP = [0, 1, 0] as Vec3


interface Camera {
  aspectRatio: number
  fov:         number
  zNear:       number
  zFar:        number
  target:      Vec3
  rotation:    Vec3
  distance:    number
}

export function createMeshDrawer(gl: WebGLRenderingContext): MeshDrawer | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }

  const camera: Camera = { 
    aspectRatio: 3 / 2,
    fov:         degToRad(60),
    zNear:       -10,
    zFar:        50,
    target:      [0, 0, 0] as Vec3,
    rotation:    [0, 0, 0] as Vec3,
    distance:     2.5
  }
  
  // uniforms
  const uniforms = {
    projection:     { p: gl.getUniformLocation(program, 'uProjection'),    t: TYPE.M4 },
    view:           { p: gl.getUniformLocation(program, 'uView'),          t: TYPE.M4 },
    world:          { p: gl.getUniformLocation(program, 'uWorld'),         t: TYPE.M4 },
    lightDirection: { p: gl.getUniformLocation(program, 'uLightDirection'),t: TYPE.V3 },
  }
  
  // attributes
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }

  const geometry = {
    vertices:      [] as Vec3[],
    definedNormals:[] as Vec3[],
    smoothNormals: [] as Vec3[],
    flatNormals:   [] as Vec3[],
  }
  
  setViewPort(600, 400)
  
  return { setObj, updateSettings, updateCamera, draw }
  
  function setObj(obj: RawObj): void {
    const readyObj = parseObj(obj)
    const { definedNormals, flatNormals, smoothNormals, vertices } = flattenParsedObj(readyObj)
    
    // console.log('normals d, f, s:', definedNormals, flatNormals, smoothNormals)
    // console.log('vertices', vertices)

    geometry.vertices = vertices
    geometry.definedNormals = definedNormals
    geometry.flatNormals = flatNormals
    geometry.smoothNormals = smoothNormals
    
    updateGeometry()
  }
  
  function updateGeometry(): void {
    
    const values = {
      position: geometry.vertices.flatMap(v => v),
      normal:   geometry.flatNormals.flatMap(n => n)
    }
    
    updateAttributes({ gl, attributes, values })
  }
  
  
  function updateSettings(newSettings: Partial<Settings>): void {
    const keys = Object.keys(newSettings)
  }
  
  function setViewPort(width: number, height: number): void {
    gl.viewport(0, 0, width, height)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    camera.aspectRatio = width / height
  }
  
  function updateCamera(rotation: Vec3, distance: number): void {
    camera.rotation = rotation
    camera.distance = distance
    
    const projection = perspective(camera.fov, camera.aspectRatio, camera.zNear, camera.zFar)
    const quaternion = degToQuaternion(rotation)
    
    const rotatedCameraMatrix = quaternionToRotationMatrix(quaternion)
    const cameraMatrix = M4.translate(rotatedCameraMatrix, 0, 0, distance)
    const cameraPosition = [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14] ] as Vec3
    
    const lookAtMatrix = lookAt(cameraPosition, camera.target, UP)
    const view = M4.inverse(lookAtMatrix)
    
    const lightPosition = [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14] ] as Vec3
    const worldCamera = M4.identity()

    gl.useProgram(program!)
    gl.uniformMatrix4fv(uniforms.projection.p, false, projection)
    gl.uniformMatrix4fv(uniforms.view.p, false, view)
    gl.uniformMatrix4fv(uniforms.world.p, false, worldCamera)
    gl.uniform3fv(uniforms.lightDirection.p, lightPosition)
  }
  
  function draw(): void {
    gl.useProgram(program!)
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    setupAttributes({ gl, attributes })
    gl.drawArrays(gl.TRIANGLES, 0, geometry.vertices.length)
    
    requestAnimationFrame(draw)
  }
}
