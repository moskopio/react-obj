import { getLightPosition } from 'src/geometry/light'
import { createLightShader } from 'src/preview/glsl/common/light-shader'
import fragmentShaderSource from 'src/preview/glsl/mesh.frag'
import vertexShaderSource from 'src/preview/glsl/mesh.vert'
import { Scene } from 'src/state/scene'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { CameraMatrices, Program, Object3D } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { flattenAndPrepare, getUniforms, updateUniforms } from 'src/webgl/uniforms'

export function createMeshProgram(gl: WebGLRenderingContext): Program | undefined {
  const fragmentShader = createLightShader(fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShader)
  
  if (!program) {
    console.error('Failed to create a WebGL Mesh Program')
    return undefined
  }
  
  let settings = createDefaultSettings()

  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
    count:    { p: gl.getAttribLocation(program, 'aCount'),    s: 1, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { updateCamera, updateSettings, updateScene, draw, cleanup }
  

  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { shading } = settings
    const values = flattenAndPrepare({ shading })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function updateCamera(camera: CameraMatrices): void {
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { ...camera }})
  }
  
  function updateScene(scene: Scene): void {
    const { ambient, fresnel, light } = scene
    const position = getLightPosition(light)
    const values = flattenAndPrepare({ light: { ...light, position }, ambient, fresnel })
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number, object: Object3D): void {
    const geometry = object.getGeometry()
    const model = object.getModel()
    
    if (settings.showMesh) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      updateAttributes({ gl, attributes, values: { ...geometry } })
      
      updateUniforms({ gl, uniforms, values: { model, time: [time] } })
      gl.drawArrays(gl.TRIANGLES, 0, geometry.count.length)
    }
  }
    
  function cleanup(): void {
    Object.values(attributes).forEach(a => a.b && gl.deleteBuffer(a.b))
    program && gl.deleteProgram(program)
  }
}
