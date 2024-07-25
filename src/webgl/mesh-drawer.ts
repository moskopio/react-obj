import vertexShaderSource from './mesh.vert'
import fragmentShaderSource from './mesh.frag'
import { createShaderProgram } from './program'
import { Obj } from '../types'

export interface MeshDrawer {
  setObj:      (obj: Obj) => void
  setViewPort: (w: number, h: number) => void
  draw:        () => void
}


export function createMeshDrawer(gl: WebGLRenderingContext): MeshDrawer | undefined {
  
  console.log(vertexShaderSource, fragmentShaderSource)
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }
  
  let triangleCount = 0
  
  const uMVP = gl.getUniformLocation(program, 'mvp')
  const aPos = gl.getAttribLocation(program, 'pos')

  const aPosBuffer = gl.createBuffer()
  
  return { setObj, setViewPort, draw }
  
  function setObj(obj: Obj): void {
    const { vertex, vertexIndex } = obj
  
    triangleCount = vertex.length / 3

    gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);  
  }
  
  function setViewPort(w: number, h: number): void {
    
  const mvp = [
      1.4960692270999916,
      0,
      -0.015421421656734475,
      -0.008944424560905996,
      -0.00008426905041067963,
      1.7297471779917424,
      -0.010857004728123754,
      -0.006297062742311778,
      0.013381748317572788,
      0.010892758455821563,
      1.7240695610833348,
      0.9999603454283343,
      0,
      0,
      1.7400000000000002,
      3
  ]
  
    // const transformationMatrix = [ 
    //    2/w,    0, 0, 0, 
    //      0, -2/h, 0, 0, 
    //      0,    0, 1, 0, 
    //     -1,    1, 0, 1 
    // ]
    gl.useProgram(program!)
    gl.uniformMatrix4fv(uMVP, false, mvp)
  }
  
  function draw(): void { 
    gl.useProgram(program!)
		gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuffer)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aPos)
		gl.drawArrays(gl.TRIANGLES, 0, triangleCount)
  }
}
