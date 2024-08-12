import { Camera } from '../../state/camera'
import { createDefaultSettings, Settings } from '../../state/settings'
import { Program } from '../../types'
import { colorToVec3 } from '../../utils/color'
import { M4 } from '../../utils/math/m4'
import { setupAttributes, updateAttributes } from '../attributes'
import { getLookAtMatrices } from '../camera'
import { createShaderProgram } from '../program'
import { TYPE, updateUniforms } from '../uniforms'
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
  }
  
  
  // uniforms
  const uniforms = {
    projection: { p: gl.getUniformLocation(program, 'uProjection'), t: TYPE.M4 },
    view:       { p: gl.getUniformLocation(program, 'uView'),       t: TYPE.M4 },
    model:      { p: gl.getUniformLocation(program, 'uModel'),      t: TYPE.M4 },
    time:       { p: gl.getUniformLocation(program, 'uTime'),       t: TYPE.F },
    colorA:     { p: gl.getUniformLocation(program, 'uColorA'),     t: TYPE.V3 },
    colorB:     { p: gl.getUniformLocation(program, 'uColorB'),     t: TYPE.V3 },
  }
  
  createGeometry()
  return { setObj, updateCamera, updateSettings, draw }
  
  function setObj(): void { }
  
  function createGeometry(): void {
    const position = [
       2, -1,  2,
       2, -1, -2,
      -2, -1, -2,
      -2, -1, -2,
      -2, -1,  2,
       2, -1,  2,
    ]
    
    const values = { position }
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    updateColors()
  }
  
  function updateModel(): void {
    const model = M4.identity()
    gl.useProgram(program!)
    gl.uniformMatrix4fv(uniforms.model.p, false, model)
  }
  
  function updateColors(): void {
    const colorA = colorToVec3(0xB2C99E)
    const colorB = colorToVec3(0x628090)
    gl.useProgram(program!)
    gl.uniform3f(uniforms.colorA.p, ...colorA)
    gl.uniform3f(uniforms.colorB.p, ...colorB)
  }
  
  function updateCamera(camera: Camera): void {
    const {cameraPosition, ...rest} = getLookAtMatrices(camera)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: rest })
  }
  
  function draw(time: number): void {
    gl.useProgram(program!)
    setupAttributes({ gl, attributes })
    
    gl.uniform1f(uniforms.time.p, time)
    settings.showGrid && gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}
