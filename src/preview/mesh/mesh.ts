import { Camera } from '../../state/camera'
import { Light } from '../../state/light'
import { createEmptyObj, Obj } from '../../state/obj'
import { createDefaultSettings, Settings } from '../../state/settings'
import { Program } from '../../types'
import { colorToVec3, vec3ToShaderColor } from '../../utils/color'
import { setupAttributes, updateAttributes } from '../../webgl/attributes'
import { getLookAtMatrices } from '../../webgl/camera'
import { getLightPosition } from '../../webgl/light'
import { getModelMatrix } from '../../webgl/model'
import { createShaderProgram } from '../../webgl/program'
import { getUniforms, updateUniforms } from '../../webgl/uniforms'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'

const AMBIENT_COLOR  = 0x1A1A1A
const DIFFUSE_COLOR  = 0x808080
const SPECULAR_COLOR = 0xFFFFFF

export function createMeshDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Mesh Program')
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
  updateColors()
  
  return { updateObj, updateCamera, updateSettings, updateLight, draw, cleanup }
  
  function updateObj(newObj: Obj): void {
    obj = newObj 
    updateGeometry()
  }

  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    
    gl.useProgram(program!)
    const values = {
      showNormals: [settings.showNormals ? 1 : 0],
      cellShading: [settings.cellShading ? 1 : 0],
    }
    updateUniforms({ gl, uniforms, values })
    updateModel()
    updateGeometry()
  }
  
  function updateCamera(camera: Camera): void {
    const { ...values} = getLookAtMatrices(camera)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateLight(light: Light): void {
    const { specular, ambient, diffuse } = light
    const lightPosition = getLightPosition(light)
    
    const specularIntensity = [2000 - specular.intensity]
    const specularEnabled = [specular.enabled ? 1 : 0]
    
    const ambientColor = vec3ToShaderColor(ambient.color)
    const diffuseColor = vec3ToShaderColor(diffuse.color)
    const specularColor = vec3ToShaderColor(specular.color)
    
    const values = { lightPosition, specularIntensity, specularEnabled, ambientColor, diffuseColor, specularColor }
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number): void {
    if (settings.showMesh || settings.showNormals) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      updateUniforms({ gl, uniforms, values: { time: [time] } })
      gl.drawArrays(gl.TRIANGLES, 0, obj.flat.vertices.length)
    }
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => a.b && gl.deleteBuffer(a.b))
    program && gl.deleteProgram(program)
  }
  
  
  function updateGeometry(): void {
    const { flat } = obj
    
    const vertices = flat.vertices
    const normals = settings.flatNormals ? flat.flatNormals : flat.smoothNormals
    
    const values = {
      position: vertices.flatMap(v => v),
      normal:   normals.flatMap(n => n),
      count:    vertices.map((_, i) => i)
    }
    
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
    
  function updateModel(): void {
    const model = getModelMatrix(obj, settings)
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }
  
  function updateColors(): void {
    const ambientColor  = colorToVec3(AMBIENT_COLOR)
    const diffuseColor  = colorToVec3(DIFFUSE_COLOR)
    const specularColor = colorToVec3(SPECULAR_COLOR)
    const specularIntensity = [1000]

    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { ambientColor, diffuseColor, specularColor, specularIntensity}})
  }
  
}
