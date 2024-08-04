import { Dict } from "../types"

type Attributes = Dict<Attribute>
type AttributeValue = Dict<number[]>

interface Attribute {
  p: GLint,
  s: number,
  b: WebGLBuffer
}

interface UpdateArgs {
  attributes: Attributes
  gl:         WebGLRenderingContext
  values:     AttributeValue
}

export function updateAttributes(args: UpdateArgs): void {
  const { attributes, gl, values } = args
  
  const attributeNames = Object.keys(values)
  
  attributeNames.forEach(name => {
    const attribute = attributes[name]
    const value = values[name]
    if (attribute && value) {
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.b)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value), gl.STATIC_DRAW)
    }
  })
}

interface SetupArgs {
  attributes: Attributes
  gl:         WebGLRenderingContext
}

export function setupAttributes(args: SetupArgs): void {
  const { attributes, gl } = args
  
  const attributeNames = Object.keys(attributes)
  
  
  attributeNames.forEach(name => {
    const attribute = attributes[name]
    if (attribute) {
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.b)
      gl.vertexAttribPointer(attribute.p, attribute.s, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attribute.p)
    }
  })
}
