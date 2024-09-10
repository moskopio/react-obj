import { createCone } from "src/geometry/primitives/cone"
import { createSphere } from "src/geometry/primitives/sphere"
import { M4 } from "src/math/m4"
import { Vec3 } from "src/math/v3"
import { Scene } from "src/state/scene"
import { Program } from "src/types"
import { setupAttributes, updateAttributes } from "src/webgl/attributes"
import { createShaderProgram } from "src/webgl/program"
import { getUniforms, prepareValues, updateUniforms } from "src/webgl/uniforms"
import { getLightMatrices } from "./light-matrices"
import fragmentShaderSource from './light.frag'
import vertexShaderSource from './light.vert'

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
    normal:   { p: gl.getAttribLocation(program, 'aNormal'),   s: 3, b: gl.createBuffer()!, }
  }
  const uniforms = getUniforms(gl, program)
  buildGeometry()
  
  return { updateScene, draw, cleanup }
  
  function updateScene(scene: Scene): void {
    const { ambient, light } = scene
    const { specular, diffuse } = light
    const { ...matrices } = getLightMatrices(light)
    
    const preparedValues = prepareValues({
      ambientColor:      ambient.color,
      ambientEnabled:    ambient.enabled,
      diffuseColor:      diffuse.color,
      diffuseEnabled:    diffuse.enabled,
      specularColor:     specular.color,
      specularIntensity: specular.intensity,
      specularEnabled:   specular.enabled
    })
    const values = { ...matrices, ...preparedValues }

    gl.useProgram(program!)
    updateUniforms({ gl, uniforms, values})
  }
  
  function draw(): void {
    gl.useProgram(program!)
    gl?.disable(gl.CULL_FACE)
    setupAttributes({ gl, attributes })
    
    // 1. Sphere
    // 1A. Outline
    updateUniforms({ gl, uniforms, values: { model: SPHERE_MODEL, useOutline: [1] } })
    gl.drawArrays(gl.TRIANGLES, 51, 1350)
    gl?.clear(gl.DEPTH_BUFFER_BIT)
    // 1B. Shading
    updateUniforms({ gl, uniforms, values: { model: SPHERE_MODEL, useLight: [1], useOutline: [0] } })
    gl.drawArrays(gl.TRIANGLES, 51, 1350)
    
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
    const sphere = createSphere(15, 15) //15 * 15 * 2 * 3 = 1350
    const cone = createCone(16) // 16 * 3 + 3 = 51
    
    const position: Vec3[] = [...cone.vertices, ...sphere.vertices]
    const normal: Vec3[] = [...cone.normals, ...sphere.normals]
    const values = { 
      position: new Float32Array(position.flatMap(p => p)), 
      normal: new Float32Array(normal.flatMap(n => n)) 
    }

    gl.useProgram(program!)
    updateAttributes({ gl, attributes, values })
  }
}
