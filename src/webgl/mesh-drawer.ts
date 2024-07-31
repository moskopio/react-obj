import { Obj } from '../types'
import { lookAt, perspective } from '../utils/camera'
import { M4 } from '../utils/m4'
import { degToQuaternion } from '../utils/quaternion'
import { degToRad } from '../utils/util'
import { Vec3 } from '../utils/v3'
import fragmentShaderSource from './mesh.frag'
import vertexShaderSource from './mesh.vert'
import { createShaderProgram } from './program'

export interface MeshDrawer {
  setObj:       (obj: Obj) => void
  setViewPort:  (width: number, height: number) => void
  updateCamera: (rotation: Vec3, distance: number) => void
  draw:         () => void
}


const UP = [0, 1, 0] as Vec3

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
  const aNormal = gl.getAttribLocation(program, 'aNormal')
  
  const aPosBuffer = gl.createBuffer()
  const aNormalBuffer = gl.createBuffer()
  const indexBuffer = gl.createBuffer()
  
  gl.useProgram(program!)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  
  let aspectRatio = 3 / 2
  const fov = degToRad(60)
  const zNear = 0.1
  const zFar = 50
  const cameraTarget = [0, 0, 0] as Vec3
  
  return { setObj, setViewPort, updateCamera, draw }
  
  function setObj(obj: Obj): void {
    const { vertex, vertexIndex, normal } = obj
    
    triangleCount = vertexIndex.length
    
    gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
    
    gl.bindBuffer(gl.ARRAY_BUFFER, aNormalBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndex), gl.STATIC_DRAW)
  }
  
  function setViewPort(width: number, height: number): void {
    gl.viewport(0, 0, width, height)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    aspectRatio = width / height
  }
  
  function updateCamera(rotation: Vec3, distance: number): void {
    const projection = perspective(fov, aspectRatio, zNear, zFar)
    const quaternion = degToQuaternion(rotation)
    
    const rotatedCameraMatrix = M4.compose([0, 0, 0], quaternion, [1, 1, 1])
    const cameraMatrix = M4.translate(rotatedCameraMatrix, 0, 0, distance)
    const cameraPosition = [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14] ] as Vec3
    
    const camera = lookAt(cameraPosition, cameraTarget, UP)
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
    
    gl.bindBuffer(gl.ARRAY_BUFFER, aNormalBuffer)
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aNormal)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.drawElements(gl.TRIANGLES, triangleCount, gl.UNSIGNED_SHORT, 0)
  }
}
