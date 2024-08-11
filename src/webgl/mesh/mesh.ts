import { Camera } from '../../state/camera'
import { createEmptyObj, Obj } from '../../state/obj'
import { createDefaultSettings, Settings } from '../../state/settings'
import { Program } from '../../types'
import { M4 } from '../../utils/math/m4'
import { setupAttributes, updateAttributes } from '../attributes'
import { getLookAtMatrices } from '../camera'
import { getModelMatrix } from '../model'
import { createShaderProgram } from '../program'
import { TYPE, updateUniforms } from '../uniforms'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'

export function createMeshDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Program')
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
  const uniforms = {
    projection:     { p: gl.getUniformLocation(program, 'uProjection'),    t: TYPE.M4 },
    view:           { p: gl.getUniformLocation(program, 'uView'),          t: TYPE.M4 },
    model:          { p: gl.getUniformLocation(program, 'uModel'),         t: TYPE.M4 },
    cameraPosition: { p: gl.getUniformLocation(program, 'uCameraPosition'),t: TYPE.V3 },
    time:           { p: gl.getUniformLocation(program, 'uTime'),          t: TYPE.F },
    showNormals:    { p: gl.getUniformLocation(program, 'uShowNormals'),   t: TYPE.B },
  }
    
  return { setObj, updateCamera, updateSettings, draw }
  
  function setObj(newObj: Obj): void {
    obj = newObj 
    updateGeometry()
  }
  
  function updateGeometry(): void {
    const { flat } = obj
    
    const values = {
      position: flat.vertices.flatMap(v => v),
      normal:   flat.smoothNormals.flatMap(n => n)
    }
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    updateModel()
  }
  
  function updateModel(): void {
    const model = getModelMatrix(obj, settings)
    
    gl.useProgram(program!)
    gl.uniformMatrix4fv(uniforms.model.p, false, model)
  }
  
  function updateCamera(camera: Camera): void {
    const {cameraPosition, ...rest} = getLookAtMatrices(camera)

    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: rest })
    gl.uniform3fv(uniforms.cameraPosition.p, cameraPosition)
  }
  
  function draw(time: number): void {
    if (settings.showMesh || settings.showNormals) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      gl.uniform1f(uniforms.time.p, time)
      gl.uniform1i(uniforms.showNormals.p, settings.showNormals ? 1 : 0)
      gl.drawArrays(gl.TRIANGLES, 0, obj.flat.vertices.length)
    }
  }
}
