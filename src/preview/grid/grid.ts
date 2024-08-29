import { Camera } from '../../state/camera'
import { createDefaultSettings, Settings } from '../../state/settings'
import { Program } from '../../types'
import { M4 } from '../../utils/math/m4'
import { setupAttributes, updateAttributes } from '../../webgl/attributes'
import { getLookAtMatrices } from '../../webgl/camera'
import { createShaderProgram } from '../../webgl/program'
import { getUniforms, prepareValues, updateUniforms } from '../../webgl/uniforms'
import fragmentShaderSource from './grid.frag'
import vertexShaderSource from './grid.vert'


export function createGridDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }
  
  let settings = createDefaultSettings()
  
  // attributes
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal: { p: gl.getAttribLocation(program, 'aNormal'), s: 3, b: gl.createBuffer()! },
  }  
  const uniforms = getUniforms(gl, program)
  
  createGeometry()
  
  return { updateCamera, updateSettings, draw, cleanup }
  
  function createGeometry(): void {
    const position = [
       2, -1,  2,
       2, -1, -2,
      -2, -1, -2,
      -2, -1, -2,
      -2, -1,  2,
       2, -1,  2,
    ]
    
    const normal = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ]
    
    const values = { position, normal }
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    updateGrid()
  }
  
  function updateModel(): void {
    const model = M4.identity()
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }
  
  function updateGrid(): void {
    const { grid } = settings    
    const values = prepareValues({...grid})
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values})
  }
  
  function updateCamera(camera: Camera): void {
    const { ...values } = getLookAtMatrices(camera)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number): void {
    gl.useProgram(program!)
    setupAttributes({ gl, attributes })
    
    updateUniforms({ gl, uniforms, values: { time: [time] } })
    settings.showGrid && gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
