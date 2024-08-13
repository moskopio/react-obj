import { Dict } from "../types"
import { prepareName } from "./name"

interface Uniform {
  loc:  WebGLUniformLocation | null
  type: GLenum
}

type Uniforms = Dict<Uniform>

export function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Uniforms {
  const uniforms: Uniforms = {}
  
  const uniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i=0; i < uniformsCount; i++) {
    const uniform = gl.getActiveUniform(program, i)
    if (uniform) {
      const name = prepareName(uniform.name)
      const location = gl.getUniformLocation(program, uniform.name)
      const type = uniform.type
      
      uniforms[name] = { loc: location, type } 
    }
  }
  
  return uniforms
}


type Values = Dict<number[] >

interface UpdateArgs {
  gl:       WebGLRenderingContext
  uniforms: Uniforms
  values:   Values
}

export function updateUniforms(args: UpdateArgs): void {
  const { gl, uniforms, values } = args
  
  const uniformNames = Object.keys(values)
  
  uniformNames.forEach(name => {
    const uniform = uniforms[name]
    
    if (uniform && uniform.loc && values[name]) {
      switch (uniform.type) {
        case gl.FLOAT_MAT4: 
          gl.uniformMatrix4fv(uniform.loc, false, values[name])
          break
        case gl.FLOAT_VEC3:
          gl.uniform3fv(uniform.loc, values[name])
          break
        case gl.FLOAT_VEC4:
          gl.uniform4fv(uniform.loc, values[name])
          break
        case gl.BOOL:
          gl.uniform1iv(uniform.loc, values[name])
          break
        case gl.FLOAT: 
          gl.uniform1fv(uniform.loc, values[name])
          break
      }
    }
  })
}
