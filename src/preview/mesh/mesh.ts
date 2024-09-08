import { Camera } from '../../state/camera'
import { Light } from '../../state/light'
import { createEmptyObj, Obj } from '../../state/obj'
import { createDefaultSettings, Settings } from '../../state/settings'
import { Program } from '../../types'
import { setupAttributes, updateAttributes } from '../../webgl/attributes'
import { getLookAtMatrices } from '../../webgl/camera'
import { getLightPosition } from '../../webgl/light'
import { getModelMatrix } from '../../webgl/model'
import { createShaderProgram } from '../../webgl/program'
import { flattenAndPrepare, getUniforms, updateUniforms } from '../../webgl/uniforms'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'
import { createLightShader } from '../common/light-shader'

export function createMeshDrawer(gl: WebGLRenderingContext): Program | undefined {
  const fragmentShader = createLightShader(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShader)
  
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
  
  return { updateObj, updateCamera, updateSettings, updateLight, draw, cleanup }
  
  function updateObj(newObj: Obj): void {
    obj = newObj 
    updateGeometry()
  }

  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { shading } = settings
    const values = flattenAndPrepare({ shading })
    
    gl.useProgram(program!)
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
    const { specular, ambient, fresnel, diffuse, followsCamera } = light
    const position = getLightPosition(light)
    
    const lightValues = {
      diffuse, 
      followsCamera,
      position,
      specular, 
      fresnel,
    }
    const values = flattenAndPrepare({ light: lightValues, ambient })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number): void {
    if (settings.showMesh) {
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
    const { useFlat, useDefined } = settings.normals
    
    const vertices = flat.vertices
    const hasDefinedNormals = flat.definedNormals.length === vertices.length
    
    const normals = useFlat 
      ? flat.flatNormals 
      : useDefined && hasDefinedNormals 
        ? flat.definedNormals 
        : flat.smoothNormals
    
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
}
