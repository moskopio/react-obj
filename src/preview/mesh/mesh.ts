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
import { getUniforms, updateUniforms } from '../../webgl/uniforms'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'

export function createMeshDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Mesh Program')
    cleanup()
    return undefined
  }
  
  let obj = createEmptyObj()
  let settings = createDefaultSettings()
  
  // attributes
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }

  // uniforms
  const uniforms = getUniforms(gl, program)
  
  return { setObj, updateCamera, updateSettings, updateLight, draw, cleanup }
  
  function setObj(newObj: Obj): void {
    obj = newObj 
    updateGeometry()
  }
  
  function updateGeometry(): void {
    const { flat } = obj
    
    const vertices = flat.vertices
    const normals = settings.flatNormals ? flat.flatNormals : flat.smoothNormals
    
    const values = {
      position: vertices.flatMap(v => v),
      normal:   normals.flatMap(n => n)
    }
    updateAttributes({ gl, attributes, values })
    updateModel()
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
  
  function updateModel(): void {
    const model = getModelMatrix(obj, settings)
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }
  
  function updateCamera(camera: Camera): void {
    const { ...values} = getLookAtMatrices(camera)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateLight(light: Light): void {
    const lightPosition = getLightPosition(light)
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { lightPosition } })
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
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
