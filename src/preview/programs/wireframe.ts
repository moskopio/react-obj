import fragmentShaderSource from 'src/preview/glsl/wireframe.frag'
import vertexShaderSource from 'src/preview/glsl/wireframe.vert'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Object3D, Program, ViewMatrices } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { flattenAndPrepare, getUniforms, updateUniforms } from 'src/webgl/uniforms'

export function createWireframeProgram(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Wireframe Program')
    return undefined
  }

  let settings = createDefaultSettings()
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { updateViews, updateSettings, draw, cleanup }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { wireframe } = settings
    const values = flattenAndPrepare({ wireframe })
  
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateViews(values: ViewMatrices): void {
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number, object: Object3D): void {
    const geometry = object.getGeometry()
    const model = object.getModel()
    
    if (settings.wireframe.enabled) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      updateAttributes({ gl, attributes, values: { ...geometry } })
      
      updateUniforms({ gl, uniforms, values: { model, time: [time] } })
      gl.drawArrays(gl.LINES, 0, geometry.count.length)
    }
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
