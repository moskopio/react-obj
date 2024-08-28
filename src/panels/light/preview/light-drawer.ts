import { Light } from "../../../state/light"
import { Program } from "../../../types"
import { colorToVec3, vec3ToShaderColor } from "../../../utils/color"
import { M4 } from "../../../utils/math/m4"
import { Vec3 } from "../../../utils/math/v3"
import { setupAttributes, updateAttributes } from "../../../webgl/attributes"
import { createCone, createSphere } from "../../../webgl/primitives"
import { createShaderProgram } from "../../../webgl/program"
import { getUniforms, updateUniforms } from "../../../webgl/uniforms"
import { getLightMatrices } from "./light-matrices"
import fragmentShaderSource from './light.frag'
import vertexShaderSource from './light.vert'

const ACCENT_COLOR_A = 0xB2C99E
const ACCENT_COLOR_B = 0x628090
const ACCENT_COLOR_C = 0xBF5C38

const SPHERE_MODEL = M4.scaling([0.6, 0.6, 0.6])
const CONE_MODEL   = M4.combine(M4.translation([0,0,1.1]),M4.scaling([0.2, 0.2, 0.1]))

export function createLightDrawer(gl: WebGLRenderingContext): Program | undefined {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
  
  if (!program) {
    console.error('Failed to create a WebGL Program')
    return undefined
  }
  
  const attributes = {
    position: { p: gl.getAttribLocation(program, 'aPosition'), s: 3, b: gl.createBuffer()!, },
    normal: { p: gl.getAttribLocation(program, 'aNormal'), s: 3, b: gl.createBuffer()!, }
  }
  const uniforms = getUniforms(gl, program)
  
  buildGeometry()
  
  return { updateLight, draw, cleanup }
  
  function updateLight(light: Light): void {
    const { specular, ambient, diffuse } = light
    const { ...matrices } = getLightMatrices(light)
    
    const ambientColor = vec3ToShaderColor(ambient.color)
    const diffuseColor = vec3ToShaderColor(diffuse.color)
    const specularColor = vec3ToShaderColor(specular.color)
    
    const specularIntensity = [2000 - specular.intensity]
    const specularEnabled = [specular.enabled ? 1 : 0]
    const values = { ...matrices, specularIntensity, specularEnabled, ambientColor, diffuseColor, specularColor} 
    
    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values})
  }
  
  function draw(_: number): void {
    gl.useProgram(program!)
    gl?.disable(gl.CULL_FACE)
    setupAttributes({ gl, attributes })
    
    // 1. Sphere
    // 1A. Outline
    updateUniforms({ gl, uniforms, values: { model: SPHERE_MODEL, useOutline: [1] } })
    gl.drawArrays(gl.TRIANGLES, 51, 600)
    gl?.clear(gl.DEPTH_BUFFER_BIT)
    // 1B. Shading
    updateUniforms({ gl, uniforms, values: { model: SPHERE_MODEL, useLight: [1], useOutline: [0] } })
    gl.drawArrays(gl.TRIANGLES, 51, 600)
    
    // 2. Cone
    // 2A. Outline
    updateUniforms({ gl, uniforms, values: { model: CONE_MODEL, useOutline: [1] } })
    gl.drawArrays(gl.TRIANGLES, 0, 51)
    gl?.clear(gl.DEPTH_BUFFER_BIT)
    // 2B. Shading
    updateUniforms({ gl, uniforms, values: { model: CONE_MODEL, useLight: [0], useOutline: [0] } })
    gl.drawArrays(gl.TRIANGLES, 0, 51)
  }
  
  function cleanup(): void {
    Object.values(attributes).forEach(a => gl.deleteBuffer(a.b))
    gl.deleteProgram(program!)
  }
  
  function buildGeometry(): void {
    const sphere = createSphere(10, 10) //10 * 10 * 2 * 3 = 600
    const cone = createCone(16) // 16 * 3 + 3 = 51
    
    const position: Vec3[] = [...cone.vertices, ...sphere.vertices]
    const normal: Vec3[] = [...cone.normals, ...sphere.normals]
    const values = { position: position.flatMap(p => p), normal: normal.flatMap(n => n) }

    gl.useProgram(program!)
    updateAttributes({ gl, attributes, values })
    const colorA = colorToVec3(ACCENT_COLOR_A)
    const colorB = colorToVec3(ACCENT_COLOR_B)
    const colorC = colorToVec3(ACCENT_COLOR_C)
    
    updateUniforms({ gl, uniforms, values: { colorA, colorB, colorC } })
  }
}
