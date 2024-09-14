import { getLightPosition } from 'src/geometry/light'
import { createShadowOnlyShader } from 'src/preview/glsl/common/shaders'
import fragmentShaderSource from 'src/preview/glsl/grid.frag'
import vertexShaderSource from 'src/preview/glsl/grid.vert'
import { Scene } from 'src/state/scene'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Object3D, Program, ViewMatrices } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { flattenAndPrepare, getUniforms, prepareValues, updateUniforms } from 'src/webgl/uniforms'

export function createGridProgram(gl: WebGLRenderingContext): Program | undefined {
  
  const fragment = createShadowOnlyShader(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragment)
  if (!program) {
    console.error('Failed to create a Grid WebGL Program')
    return undefined
  }
  let settings = createDefaultSettings()
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }  
  const uniforms = getUniforms(gl, program)
  
  return { updateSettings, updateCamera, updateScene, draw, cleanup }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { grid } = settings
    const values = prepareValues({ ...grid })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateCamera(values: ViewMatrices): void {
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateScene(scene: Scene): void {
    const { light } = scene
    const { projection: lightProjection, view: lightView } = getLightPosition(light)
    const values = flattenAndPrepare({ lightView, lightProjection })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number, object: Object3D): void {
    const geometry = object.getGeometry()
    const model = object.getModel()
    
    if (settings.grid.enabled) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      updateAttributes({ gl, attributes, values: { ...geometry } })
      
      updateUniforms({ gl, uniforms, values: { model, time: [time] } })
      gl.drawArrays(gl.TRIANGLES, 0, geometry.count.length)
    }
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
