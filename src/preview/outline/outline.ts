import { Camera } from '../../state/camera'
import { createEmptyObj, Obj } from '../../state/obj'
import { createDefaultSettings, Settings } from '../../state/settings'
import { Program } from '../../types'
import { colorToVec3 } from '../../utils/color'
import { setupAttributes, updateAttributes } from '../../webgl/attributes'
import { getLookAtMatrices } from '../../webgl/camera'
import { getModelMatrix } from '../../webgl/model'
import { createShaderProgram } from '../../webgl/program'
import { getUniforms, updateUniforms } from '../../webgl/uniforms'
import fragmentShaderSource from './outline.frag'
import vertexShaderSource from './outline.vert'

const BLACK_OUTLINE = [0x000000, 0x111111]
const ACCENT_OUTLINE = [0xB2C99E, 0x628090]


export function createOutlineDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Outline Program')
    return undefined
  }
  
  let obj = createEmptyObj()
  let settings = createDefaultSettings()
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()! },
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()! },
  }
  const uniforms = getUniforms(gl, program)
  
  return { updateObj, updateCamera, updateSettings, draw, cleanup }
  
  function updateObj(newObj: Obj): void {
    // Outline uses reversed geometry!
    obj = {
      ...newObj,
      flat: {
        vertices:       [...newObj.flat.vertices].reverse(),
        flatNormals:    [...newObj.flat.flatNormals].reverse(),
        smoothNormals:  [...newObj.flat.smoothNormals].reverse(),
        definedNormals: [...newObj.flat.definedNormals].reverse(),
      }
    }
    updateGeometry()
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
    updateModel()
    updateColors()
    updateGeometry()
  }
  
  function updateCamera(camera: Camera): void {
    const { ...values } = getLookAtMatrices(camera)
    const outline = [0.5 * camera.dolly]
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: {...values, outline } })
  }
  
  function draw(time: number): void {
    if (settings.showOutline || settings.showReverseOutline) {
      gl.useProgram(program!)
      setupAttributes({ gl, attributes })
      
      updateUniforms({ gl, uniforms, values: { time: [time] } })
      gl.drawArrays(gl.TRIANGLES, 0, obj.flat.vertices.length)
      
      const shouldCleanDepth = settings.showOutline && !settings.showReverseOutline
      shouldCleanDepth && gl?.clear(gl.DEPTH_BUFFER_BIT)
    }
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
  
  function updateGeometry(): void {
    const { flat } = obj
    
    const vertices = flat.vertices
    const normals  = settings.flatNormals ? flat.flatNormals : flat.smoothNormals
    
    const values = {
      position: vertices.flatMap(v => v),
      normal:   normals.flatMap(n => n)
    }
    updateAttributes({ gl, attributes, values })
    updateModel()
  }
  
  function updateModel(): void {
    const model = getModelMatrix(obj, settings)
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { model } })
  }
  
  function updateColors(): void {
    const colorA = settings.showReverseOutline 
      ? colorToVec3(BLACK_OUTLINE[0]) 
      : colorToVec3(ACCENT_OUTLINE[0])
    
    const colorB = settings.showReverseOutline 
      ? colorToVec3(BLACK_OUTLINE[1])
      : colorToVec3(ACCENT_OUTLINE[1])
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values: { colorA, colorB }})
  }
}
