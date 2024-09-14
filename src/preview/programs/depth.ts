import fragmentShaderSource from 'src/preview/glsl/depth.frag'
import vertexShaderSource from 'src/preview/glsl/depth.vert'
import { Object3D, Program, ViewMatrices } from 'src/types'
import { setupAttributes, updateAttributes } from 'src/webgl/attributes'
import { createShaderProgram } from 'src/webgl/program'
import { getUniforms, updateUniforms } from 'src/webgl/uniforms'

export function createDepthProgram(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Depth Program')
    return undefined
  }
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
return { updateViews, draw, cleanup }
    
  function updateViews(values: ViewMatrices): void {
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values})
  }
      
  function draw(time: number, object: Object3D): void {
    const geometry = object.getGeometry()
    const model = object.getModel()
    
    gl.useProgram(program!)
    setupAttributes({ gl, attributes })
    updateAttributes({ gl, attributes, values: { ...geometry } })
    
    updateUniforms({ gl, uniforms, values: { model, time: [time] } })
    gl.drawArrays(gl.TRIANGLES, 0, geometry.count.length)
  }
    
  function cleanup(): void {
    Object.values(attributes).forEach(a => a.b && gl.deleteBuffer(a.b))
    program && gl.deleteProgram(program)
  }
}
