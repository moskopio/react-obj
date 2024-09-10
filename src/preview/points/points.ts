import { getLookAtMatrices } from "src/geometry/camera"
import { getLightPosition } from "src/geometry/light"
import { getModelMatrix } from "src/geometry/model"
import { Vec3 } from "src/math/v3"
import { Camera } from "src/state/camera"
import { Obj } from "src/state/obj"
import { Scene } from "src/state/scene"
import { createDefaultSettings, Settings } from "src/state/settings"
import { Program } from "src/types"
import { setupAttributes, updateAttributes } from "src/webgl/attributes"
import { createShaderProgram } from "src/webgl/program"
import { flattenAndPrepare, getUniforms, updateUniforms } from "src/webgl/uniforms"
import { createLightShader } from "../common/light-shader"
import fragmentShaderSource from './points.frag'
import vertexShaderSource from './points.vert'

export function createPointsDrawer(gl: WebGLRenderingContext): Program | undefined {
  const fragmentShader = createLightShader(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShader)
  
  if (!program) {
    console.error('Failed to create a WebGL Wireframe Program')
    return undefined
  }
  const geometry = {
    vertices:    new Float32Array(),
    normals:     new Float32Array(),
    count:       new Float32Array(),
    boundingBox: [[0, 0, 0], [0, 0, 0]] as [Vec3, Vec3]
  }
  
  let settings = createDefaultSettings()
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
    count:    { p: gl.getAttribLocation(program, 'aCount'),    s: 1, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { draw, updateObj, updateSettings, updateCamera, updateScene, cleanup } 
  
  
  function draw(time: number): void {
    if (settings.points.enabled) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      updateUniforms({ gl, uniforms, values: { time: [time] } })
      gl.drawArrays(gl.POINTS, 0, geometry.count.length)
      gl.clear(gl.DEPTH_BUFFER_BIT)
    }
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { points, shading } = settings
    const values = flattenAndPrepare({ points, shading })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
    updateModel()
  }
  
  function updateCamera(camera: Camera): void {
    const { ...values } = getLookAtMatrices(camera)

    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateObj(obj: Obj): void {
    const { wireframe, parsed } = obj
    const { boundingBox } = parsed
    
    const vertices = wireframe.vertices.filter((_, i) => i % 2)
    const normals = wireframe.smoothNormals.filter((_, i) => i % 2)
    
    geometry.vertices = new Float32Array(vertices.flatMap(v => v))
    geometry.normals = new Float32Array(normals.flatMap(v => v))
    geometry.count = new Float32Array(vertices.map((_, i) => i))
    geometry.boundingBox = boundingBox
    
    updateGeometry()
  }
  
  function updateScene(scene: Scene): void {
    const { light, ambient, fresnel } = scene
    const position = getLightPosition(light)
    const values = flattenAndPrepare({ light: {...light, position }, ambient, fresnel })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateGeometry(): void {
    const { vertices, normals, count } = geometry
    
    const values = {
      position: vertices,
      normal:   normals,
      count
    }
    
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateModel(): void {
    const { boundingBox } = geometry
    const model = getModelMatrix(boundingBox, settings)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
