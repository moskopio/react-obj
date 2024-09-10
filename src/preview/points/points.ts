import { getLookAtMatrices } from "src/geometry/camera"
import { getLightPosition } from "src/geometry/light"
import { getModelMatrix } from "src/geometry/model"
import { Camera } from "src/state/camera"
import { createEmptyObj, Obj } from "src/state/obj"
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
  
  let obj = createEmptyObj()
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
      gl.drawArrays(gl.POINTS, 0, obj.wireframe.vertices.length / 2)
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
  
  function updateObj(newObj: Obj): void {
    obj = newObj 
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
    const { wireframe } = obj
    
    const vertices = wireframe.vertices.filter((_, i) => i % 2)
    const normals = wireframe.smoothNormals.filter((_, i) => i % 2)
    
    const size = wireframe.vertices.length / 2
    
    const values = {
      position: vertices.flatMap(v => v),
      normal:   normals.flatMap(n => n),
      count:    vertices.map((_, i) => i / size)
    }
    
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateModel(): void {
    const model = getModelMatrix(obj, settings)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
