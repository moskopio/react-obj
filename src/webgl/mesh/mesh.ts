import { Vec3 } from '../../math/v3'
import { Camera } from '../../state/camera'
import { Obj } from '../../state/obj'
import { Settings } from '../../state/settings'
import { Program } from '../../types'
import { setupAttributes, updateAttributes } from '../attributes'
import { getLookAtMatrices } from '../camera'
import { createShaderProgram } from '../program'
import { TYPE, updateUniforms } from '../uniforms'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'

export function createMeshDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }
  
  // attributes
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }
  
  // uniforms
  const uniforms = {
    projection:     { p: gl.getUniformLocation(program, 'uProjection'),    t: TYPE.M4 },
    view:           { p: gl.getUniformLocation(program, 'uView'),          t: TYPE.M4 },
    world:          { p: gl.getUniformLocation(program, 'uWorld'),         t: TYPE.M4 },
    lightDirection: { p: gl.getUniformLocation(program, 'uLightDirection'),t: TYPE.V3 },
    time:           { p: gl.getUniformLocation(program, 'uTime'),          t: TYPE.F },
  }
  
  const settings = {
    isRendering: true
  }
  
  const geometry = {
    vertices:      [] as Vec3[],
    definedNormals:[] as Vec3[],
    smoothNormals: [] as Vec3[],
    flatNormals:   [] as Vec3[],
  }
  
  return { setObj, updateCamera, updateSettings, draw }
  
  function setObj(obj: Obj): void {
    const { flat } = obj

    geometry.vertices = flat.vertices
    geometry.definedNormals = flat.definedNormals
    geometry.flatNormals = flat.flatNormals
    geometry.smoothNormals = flat.smoothNormals
    
    updateGeometry()
  }
  
  function updateGeometry(): void {
    const values = {
      position: geometry.vertices.flatMap(v => v),
      normal:   geometry.flatNormals.flatMap(n => n)
    }
    updateAttributes({ gl, attributes, values })
  }
  
  function updateSettings(newSettings: Settings): void {
    settings.isRendering = newSettings.showMesh
  }
  
  function updateCamera(camera: Camera): void {
    const {cameraPosition, ...rest} = getLookAtMatrices(camera)

    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: rest })
    gl.uniform3fv(uniforms.lightDirection.p, cameraPosition)
  }
  
  function draw(time: number): void {
    if (settings.isRendering) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      gl.uniform1f(uniforms.time.p, time)
      gl.drawArrays(gl.TRIANGLES, 0, geometry.vertices.length)
    }
  }
}
