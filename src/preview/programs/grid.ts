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
  let lastObjectName = ''
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { cleanup, draw, updateCamera, updateScene, updateSettings }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
  
  function draw(time: number, object: Object3D): void {
    const geometry = object.getGeometry()
    const model = object.getModel()
    const objectName = object.getName()
    
    if (settings.grid.enabled) {
      // technically grid could be used to display something else too, hence the check
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      if (lastObjectName !== objectName) {
        updateAttributes({ gl, attributes, values: { ...geometry } })
        updateUniforms({ gl, uniforms, values: { model } })
        lastObjectName = objectName
      }
      
      updateUniforms({ gl, uniforms, values: { time: [time] } })
      gl.drawArrays(gl.TRIANGLES, 0, geometry.count.length)
    }
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
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { grid } = settings
    const values = prepareValues({ ...grid })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
}
