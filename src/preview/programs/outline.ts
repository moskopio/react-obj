import { createDefaultSettings, Settings } from 'src/state/settings'
import { ViewMatrices, Program, Object3D } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { getUniforms, prepareValues, updateUniforms } from 'src/webgl/uniforms'
import fragmentShaderSource from 'src/preview/glsl/outline.frag'
import vertexShaderSource from 'src/preview/glsl/outline.vert'

export function createOutlineProgram(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Outline Program')
    return undefined
  }
  let settings = createDefaultSettings()
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { updateCamera, updateSettings, draw, cleanup }
  
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings

    const { outline } = settings
    const values = prepareValues({...outline})
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateCamera(values: ViewMatrices): void {
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values})
  }
  
  function draw(time: number, object: Object3D): void {
    const geometry = object.getGeometry()
    const model = object.getModel()
    
    const { outline } = settings
    if (outline.enabled) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      updateAttributes({ gl, attributes, values: { ...geometry } })
      updateUniforms({ gl, uniforms, values: { model, time: [time] } })
      gl.drawArrays(gl.TRIANGLES, 0, geometry.count.length)
      !outline.useReverse && gl.clear(gl.DEPTH_BUFFER_BIT)
    }
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
