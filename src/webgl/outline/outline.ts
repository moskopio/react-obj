import { degToRad } from '../../math/angles'
import { Vec3 } from '../../math/v3'
import { flattenParsedObj } from '../../obj/flatten'
import { parseObj } from '../../obj/parse'
import { RawObj } from '../../obj/read'
import { Program } from '../../types'
import { setupAttributes, updateAttributes } from '../attributes'
import { getLookAtMatrices } from '../camera'
import { createShaderProgram } from '../program'
import fragmentShaderSource from './outline.frag'
import vertexShaderSource from './outline.vert'

enum TYPE { 
  M4 = 1,
  V3 = 2,
  V4 = 3,
  Bool = 4,
  F = 5,
}

export function createOutlineDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }

  const camera = { 
    aspectRatio: 3 / 2,
    fov:         degToRad(60),
    zNear:       -10,
    zFar:        50,
    target:      [0, 0, 0] as Vec3,
    rotation:    [0, 0, 0] as Vec3,
    position:    [0, 0, 2.5] as Vec3,
  }
  
  // uniforms
  const uniforms = {
    projection: { p: gl.getUniformLocation(program, 'uProjection'), t: TYPE.M4 },
    view:       { p: gl.getUniformLocation(program, 'uView'),       t: TYPE.M4 },
    world:      { p: gl.getUniformLocation(program, 'uWorld'),      t: TYPE.M4 },
    time:       { p: gl.getUniformLocation(program, 'uTime'),       t: TYPE.F },
    distance:   { p: gl.getUniformLocation(program, 'uDistance'),   t: TYPE.F },
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
  
  return { setObj, updateCamera, draw }
  
  function setObj(obj: RawObj): void {
    const readyObj = parseObj(obj)
    const flatObj = flattenParsedObj(readyObj)

    geometry.vertices = flatObj.vertices
    geometry.normals = flatObj.smoothNormals
    
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
    camera.aspectRatio = width / height
  }
  
  function updateCamera(rotation: Vec3, position: Vec3): void {
    camera.rotation = rotation
    camera.position = position
    
    const { projection, view, world } = getLookAtMatrices(camera)

    gl.useProgram(program!)
    gl.uniformMatrix4fv(uniforms.projection.p, false, projection)
    gl.uniformMatrix4fv(uniforms.view.p, false, view)
    gl.uniformMatrix4fv(uniforms.world.p, false, world)
    gl.uniform1f(uniforms.distance.p, camera.position[2])
  }
  
  function draw(time: number): void {
    gl.useProgram(program!)
    setupAttributes({ gl, attributes })
    
    gl.uniform1f(uniforms.time.p, time)
    gl.drawArrays(gl.TRIANGLES, 0, geometry.vertices.length)
    gl?.clear(gl.DEPTH_BUFFER_BIT)
  }
}
