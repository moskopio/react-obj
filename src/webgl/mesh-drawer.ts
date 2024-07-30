import vertexShaderSource from './mesh.vert'
import fragmentShaderSource from './mesh.frag'
import { createShaderProgram } from './program'
import { Obj } from '../types'
import { degToRad } from '../utils/util'
import { Vec3 } from '../utils/v3'
import { lookAt, perspective } from '../utils/camera'
import { M4 } from '../utils/m4'

export interface MeshDrawer {
  setObj:  (obj: Obj) => void
  setView: () => void
  draw:    () => void
}


export function createMeshDrawer(gl: WebGLRenderingContext): MeshDrawer | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }
  
  let triangleCount = 0
  
  const uProjection = gl.getUniformLocation(program, 'uProjection')
  const uView = gl.getUniformLocation(program, 'uView')
  const uWorld = gl.getUniformLocation(program, 'uWorld')
  const aPos = gl.getAttribLocation(program, 'aPos')
  
  const aPosBuffer = gl.createBuffer()
  
  return { setObj, setView, draw }
  
  function setObj(obj: Obj): void {
    const { vertex } = obj
    
    triangleCount = vertex.length / 3

    gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
  }
  
  function setView(): void {
    gl.viewport(0, 0, 600, 400)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    
    const fov = degToRad(60)
    const aspect = 600 / 400
    const zNear = 0.1
    const zFar = 50
    const projection = perspective(fov, aspect, zNear, zFar)
    
    const up = [0, 1, 0] as Vec3
    const cameraPosition = [0, 0, 4] as Vec3
    const cameraTarget = [0, 0, 0] as Vec3
    const camera = lookAt(cameraPosition, cameraTarget, up)
    const view = M4.inverse(camera)
    
    gl.useProgram(program!)
    gl.uniformMatrix4fv(uProjection, false, projection)
    gl.uniformMatrix4fv(uView, false, view)
    gl.uniformMatrix4fv(uWorld, false, M4.identity())
  }
  
  function draw(): void { 
    gl.useProgram(program!)
		gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuffer)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aPos)
		gl.drawArrays(gl.TRIANGLES, 0, triangleCount)
  }
}
