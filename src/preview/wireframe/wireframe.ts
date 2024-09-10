import { getLookAtMatrices } from 'src/geometry/camera'
import { getModelMatrix } from 'src/geometry/model'
import { Vec3 } from 'src/math/v3'
import { Camera } from 'src/state/camera'
import { Obj } from 'src/state/obj'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Program } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { flattenAndPrepare, getUniforms, updateUniforms } from 'src/webgl/uniforms'
import fragmentShaderSource from './wireframe.frag'
import vertexShaderSource from './wireframe.vert'

export function createWireframeDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Wireframe Program')
    return undefined
  }
  
  const geometry = {
    vertices:    new Float32Array(),
    normals:     new Float32Array(),
    boundingBox: [[0, 0, 0], [0, 0, 0]] as [Vec3, Vec3]
  }
  let settings = createDefaultSettings()
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { updateObj, updateCamera, updateSettings, draw, cleanup }
  
  function updateObj(obj: Obj): void {
    const { wireframe, boundingBox } = obj
    const { vertices, smoothNormals } = wireframe
    
    geometry.vertices = new Float32Array(vertices.flatMap(v => v))
    geometry.normals = new Float32Array(smoothNormals.flatMap(v => v))
    geometry.boundingBox = boundingBox
    updateGeometry()
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    const { wireframe } = settings
    const values = flattenAndPrepare({ wireframe })
  
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
    updateModel()
  }
  
  function updateCamera(camera: Camera): void {
    const { ...values } = getLookAtMatrices(camera)

    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values })
  }
  
  function draw(time: number): void {
    if (settings.wireframe.enabled) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      updateUniforms({ gl, uniforms, values: { time: [time] } })
      gl.drawArrays(gl.LINES, 0, geometry.vertices.length / 2)
    }
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
  
  function updateGeometry(): void {
    const { vertices, normals } = geometry
    const values = {
      position: vertices,
      normal:   normals
    }
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateModel(): void {
    const { boundingBox } = geometry
    const model = getModelMatrix(boundingBox, settings)
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }
}
