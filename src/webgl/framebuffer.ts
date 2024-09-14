export function createDepthFrameBuffer(gl: WebGLRenderingContext): WebGLFramebuffer | null {
  
  const depthTexture = createDepthTexture(gl, 2048)
  const colorTexture = createColorTexture(gl, 2048)

  const depthFramebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer)
  gl.bindTexture(gl.TEXTURE_2D, depthTexture)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,       // target
    gl.DEPTH_ATTACHMENT,  // attachment point
    gl.TEXTURE_2D,        // texture target
    depthTexture,         // texture
    0)                    // mip level
    
  gl.bindTexture(gl.TEXTURE_2D, colorTexture)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,        // target
    gl.COLOR_ATTACHMENT0,  // attachment point
    gl.TEXTURE_2D,         // texture target
    colorTexture,          // texture
    0)                     // mip level
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.log("The created frame buffer is invalid: " + status.toString())
  }
  
  gl.bindTexture(gl.TEXTURE_2D, depthTexture)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return depthFramebuffer
}

export function createDepthTexture(gl: WebGLRenderingContext, size: number): WebGLTexture | null {
  const depthTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, depthTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,      // target
    0,                  // mip level
    gl.DEPTH_COMPONENT, // internal format
    size,               // width
    size,               // height
    0,                  // border
    gl.DEPTH_COMPONENT, // format
    gl.UNSIGNED_INT,    // type
    null)               // data
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindTexture(gl.TEXTURE_2D, null)
  
  return depthTexture
}

function createColorTexture(gl: WebGLRenderingContext, size: number): WebGLTexture | null {
  const colorTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, colorTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    size,
    size,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindTexture(gl.TEXTURE_2D, null)
  
  return colorTexture
}
