import { Vec3 } from '../../math/v3'
import { flattenParsedObj } from '../../obj/flatten'
import { parseObj } from '../../obj/parse'
import { RawObj } from '../../obj/read'
import { Camera } from '../../state/camera'
import { Settings } from '../../state/settings'
import { Program } from '../../types'
import { setupAttributes, updateAttributes } from '../attributes'
import { getLookAtMatrices } from '../camera'
import { createShaderProgram } from '../program'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'

enum TYPE { 
  M4 = 1,
  V3 = 2,
  V4 = 3,
  Bool = 4,
  F = 5,
}

export function createMeshDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }
  
  const settings = {
    isRendering: true
  }
  
  // uniforms
  const uniforms = {
    projection:     { p: gl.getUniformLocation(program, 'uProjection'),    t: TYPE.M4 },
    view:           { p: gl.getUniformLocation(program, 'uView'),          t: TYPE.M4 },
    world:          { p: gl.getUniformLocation(program, 'uWorld'),         t: TYPE.M4 },
    lightDirection: { p: gl.getUniformLocation(program, 'uLightDirection'),t: TYPE.V3 },
    time:           { p: gl.getUniformLocation(program, 'uTime'),          t: TYPE.F },
  }
  
  // attributes
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }

  const geometry = {
    vertices:      [] as Vec3[],
    definedNormals:[] as Vec3[],
    smoothNormals: [] as Vec3[],
    flatNormals:   [] as Vec3[],
  }
  
  return { setObj, updateCamera, updateSettings, draw }
  
  function setObj(obj: RawObj): void {
    const readyObj = parseObj(obj)
    const flatObj = flattenParsedObj(readyObj)

    geometry.vertices = flatObj.vertices
    geometry.definedNormals = flatObj.definedNormals
    geometry.flatNormals = flatObj.flatNormals
    geometry.smoothNormals = flatObj.smoothNormals
    
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
    const { projection, view, world, cameraPosition } = getLookAtMatrices(camera)

    gl.useProgram(program!)
    gl.uniformMatrix4fv(uniforms.projection.p, false, projection)
    gl.uniformMatrix4fv(uniforms.view.p, false, view)
    gl.uniformMatrix4fv(uniforms.world.p, false, world)
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
