import { Camera } from "../../state/camera"
import { Light } from "../../state/light"
import { createEmptyObj, Obj } from "../../state/obj"
import { createDefaultSettings, Settings } from "../../state/settings"
import { Program } from "../../types"
import { setupAttributes, updateAttributes } from "../../webgl/attributes"
import { getLookAtMatrices } from "../../webgl/camera"
import { getLightPosition } from "../../webgl/light"
import { getModelMatrix } from "../../webgl/model"
import { createShaderProgram } from "../../webgl/program"
import { flattenAndPrepare, getUniforms, updateUniforms } from "../../webgl/uniforms"
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
  
  return { draw, updateObj, updateSettings, updateCamera, updateLight, cleanup } 
  
  
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
  
  function updateLight(light: Light): void {
    const { specular, ambient, diffuse, fresnel, followsCamera } = light
    const lightPosition = getLightPosition(light)
    
    const lightValues = {
      diffuse, 
      followsCamera,
      position: lightPosition,
      specular, 
      fresnel
    }
    const values = flattenAndPrepare({ light: lightValues, ambient })
    
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
