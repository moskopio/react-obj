import { Vec3 } from '../../math/v3'
import { flattenParsedObj } from '../../obj/flatten'
import { parseObj } from '../../obj/parse'
import { RawObj } from '../../obj/read'
import { wireframeFlattenObj } from '../../obj/wireframe'
import { Camera } from '../../state/camera'
import { Settings } from '../../state/settings'
import { Program } from '../../types'
import { setupAttributes, updateAttributes } from '../attributes'
import { getLookAtMatrices } from '../camera'
import { createShaderProgram } from '../program'
import fragmentShaderSource from './wireframe.frag'
import vertexShaderSource from './wireframe.vert'

enum TYPE { 
  M4 = 1,
  V3 = 2,
  V4 = 3,
  Bool = 4,
  F = 5,
}

export function createWireframeDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }
  
  const settings = {
    isRendering: false
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
    vertices: [] as Vec3[],
    normals:  [] as Vec3[],
  }
  
  setViewPort(600, 400)
  
  return { setObj, updateCamera, updateSettings, draw }
  
  function setObj(obj: RawObj): void {
    const readyObj = parseObj(obj)
    const flatObj = flattenParsedObj(readyObj)
    const wireframeObj = wireframeFlattenObj(flatObj)
    
    geometry.vertices = wireframeObj.vertices
    geometry.normals = wireframeObj.smoothNormals
    
    updateGeometry()
  }
  
  function updateGeometry(): void {
    const values = {
      position: geometry.vertices.flatMap(v => v),
      normal:   geometry.normals.flatMap(n => n)
    }
    updateAttributes({ gl, attributes, values })
  }
  
  function setViewPort(width: number, height: number): void {
    gl.viewport(0, 0, width, height)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
  }
  
  function updateSettings(newSettings: Settings): void {
    settings.isRendering = newSettings.showWireframe
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
      gl.drawArrays(gl.LINES, 0, geometry.vertices.length)
    }
  }
}
