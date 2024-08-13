import { Camera } from '../../state/camera'
import { createEmptyObj, Obj } from '../../state/obj'
import { createDefaultSettings, Settings } from '../../state/settings'
import { Program } from '../../types'
import { setupAttributes, updateAttributes } from '../../webgl/attributes'
import { getLookAtMatrices } from '../../webgl/camera'
import { getModelMatrix } from '../../webgl/model'
import { createShaderProgram } from '../../webgl/program'
import { getUniforms, updateUniforms } from '../../webgl/uniforms'
import fragmentShaderSource from './wireframe.frag'
import vertexShaderSource from './wireframe.vert'

export function createWireframeDrawer(gl: WebGLRenderingContext): Program | undefined {
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
  const uniforms = getUniforms(gl, program)
  
  return { setObj, updateCamera, updateSettings, draw }
  
  function setObj(newObj: Obj): void {
    obj = newObj 
    updateGeometry()
  }
  
  function updateGeometry(): void {
    const { wireframe } = obj
    const values = {
      position: wireframe.vertices.flatMap(v => v),
      normal:   wireframe.smoothNormals.flatMap(n => n)
    }
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateModel(): void {
    const model = getModelMatrix(obj, settings)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }

  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    updateModel()
  }
  
  function updateCamera(camera: Camera): void {
    const { ...values } = getLookAtMatrices(camera)

    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number): void {
    if (settings.showWireframe) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      updateUniforms({ gl, uniforms, values: { time: [time] } })
      gl.drawArrays(gl.LINES, 0, obj.wireframe.vertices.length)
    }
  }
}
