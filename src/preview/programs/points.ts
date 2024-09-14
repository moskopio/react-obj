import { getLightPosition } from "src/geometry/light"
import { createLightShader } from "src/preview/glsl/common/shaders"
import fragmentShaderSource from 'src/preview/glsl/points.frag'
import vertexShaderSource from 'src/preview/glsl/points.vert'
import { Scene } from "src/state/scene"
import { createDefaultSettings, Settings } from "src/state/settings"
import { Object3D, Program, ViewMatrices } from "src/types"
import { setupAttributes, updateAttributes } from "src/webgl/attributes"
import { createShaderProgram } from "src/webgl/program"
import { flattenAndPrepare, getUniforms, updateUniforms } from "src/webgl/uniforms"

export function createPointsProgram(gl: WebGLRenderingContext): Program | undefined {
  const fragmentShader = createLightShader(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShader)
  
  if (!program) {
    console.error('Failed to create a WebGL Wireframe Program')
    return undefined
  }
  let settings = createDefaultSettings()
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
    count:    { p: gl.getAttribLocation(program, 'aCount'),    s: 1, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { draw, updateSettings, updateCamera, updateScene, cleanup } 
  
  function draw(time: number, object: Object3D): void {
    const geometry = object.getGeometry()
    const model = object.getModel()
    
    if (settings.points.enabled) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      updateAttributes({ gl, attributes, values: { ...geometry } })
      
      updateUniforms({ gl, uniforms, values: { model, time: [time] } })
      gl.drawArrays(gl.POINTS, 0, geometry.count.length)
      gl.clear(gl.DEPTH_BUFFER_BIT)
    }
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { points, shading } = settings
    const values = flattenAndPrepare({ points, shading })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateCamera(values: ViewMatrices): void {
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateScene(scene: Scene): void {
    const { ambient, fresnel, light } = scene
    const { position, projection: lightProjection, view: lightView } = getLightPosition(light)
    const values = flattenAndPrepare({ 
      light: { ...light, position }, 
      ambient, 
      fresnel, 
      lightView, 
      lightProjection 
    })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
}
