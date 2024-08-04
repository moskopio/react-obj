import { Dict } from "../types"

export enum TYPE { 
  M4 = 1,
  V3 = 2,
  V4 = 3,
  B  = 4,
  F  = 5,
}

type Uniforms = Dict<Uniform>

interface Uniform {
  p: WebGLUniformLocation | null
  t: TYPE
}

type Values = Dict<number[]>

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
    
    if (uniform && uniform.p && values[name]) {
      switch (uniform.t) {
        case TYPE.M4: 
          gl.uniformMatrix4fv(uniform.p, false, values[name])
          break
        case TYPE.V3:
          gl.uniform3fv(uniform.p, values[name])
          break
        case TYPE.V4:
          gl.uniform4fv(uniform.p, values[name])
          break
        case TYPE.B:
          gl.uniform1iv(uniform.p, values[name])
          break
        case TYPE.F: 
          gl.uniform1fv(uniform.p, values[name])
          break
      }
    }
  })
}
