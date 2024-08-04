export function createShaderProgram(gl: WebGLRenderingContext, vertex: string, fragment: string): WebGLProgram | undefined {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertex)
	const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragment)
  
  const program = gl.createProgram()
  
  if (!vertexShader || !fragmentShader || !program) return undefined
  
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(gl.getProgramInfoLog(program))
		return undefined
	}
  
  return program
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | undefined {
	const shader = gl.createShader(type)
  
  if (!shader) return undefined
  
  gl.shaderSource(shader, source)
	gl.compileShader(shader)
    
  if (!gl.getShaderParameter( shader, gl.COMPILE_STATUS) ) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return undefined
  }
  
  return shader
}
