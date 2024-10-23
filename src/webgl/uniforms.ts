import { Dict } from "src/types"
import { Color, vec3ToShaderColor } from "src/utils/color"
import { isObject } from "src/utils/util"

interface Uniform {
  loc:  WebGLUniformLocation | null
  type: GLenum
}
type Uniforms = Dict<Uniform>

export function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Uniforms {
  const uniforms: Uniforms = {}
  
  const uniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < uniformsCount; i++) {
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

interface UpdateArgs {
  gl:       WebGLRenderingContext
  uniforms: Uniforms
  values:   Values
}
type Values = Dict<number[]>

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
        case gl.FLOAT_VEC2:
          gl.uniform2fv(uniform.loc, values[name])
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

interface UpdateTextureArgs {
  gl:       WebGLRenderingContext
  uniforms: Uniforms
  values:   Dict<WebGLTexture>
}

// textures counter is common across all of the programs!
export function updateUniformTextures(args: UpdateTextureArgs): void {
  const { gl, uniforms, values } = args
  const samplerUniforms = Object.keys(uniforms).filter(n => uniforms[n]?.type === gl.SAMPLER_2D)

  let textureIndex = 0
  samplerUniforms.forEach(name => {
    const uniform = uniforms[name]
    const texture = values[name]
    
    if (uniform && texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(uniform.loc, textureIndex)
      gl.activeTexture(gl.TEXTURE0 + textureIndex)
      textureIndex++
    }
  })
  gl.bindTexture(gl.TEXTURE_2D, null)
}

function prepareName(name: string): string {
  const noPrefix = name[0] === 'u' || name[0] === 'a' ? name.slice(1) : name
  const noUppercase = noPrefix[0].toLowerCase() + noPrefix.slice(1)
  return noUppercase
}

export function prepareValues(values: Dict<number | number[] | boolean>): Values {
  const prepared: Values = {}
  const valuesNames = Object.keys(values)
  
  valuesNames.forEach(name => {
    const value = values[name]
    if (typeof value == 'number') {
      prepared[name] = [value] as number[]
    } else if (typeof value == 'boolean') {
      prepared[name] = [value ? 1 : 0]
    } else if (name.toLocaleLowerCase().includes('color')) {
      prepared[name] = vec3ToShaderColor(value as Color)
    } else {
      prepared[name] = value as number[]
    }
  })
  
  return prepared
} 

//eslint-disable-next-line
export function flattenValues(values: Dict<any>): Dict<number | number[] | boolean> {
  const flatValues: Dict<number | number[] | boolean> = {}

  for (const key in values) {
    if (isObject(values[key])) {
      const flatObject = flattenValues(values[key])
      for (const key2 in flatObject) {
        flatValues[key + '.' + key2] = flatObject[key2]
      }
    } else {
      flatValues[key] = values[key]
    }
  }
  return flatValues
}

//eslint-disable-next-line
export function flattenAndPrepare(values: Dict<any>): Values {
  return prepareValues(flattenValues(values))
}
