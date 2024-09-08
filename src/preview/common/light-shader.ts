import precision from './precision.glsl'
import light from './light.glsl'
import shading from './shading.glsl'
import lightShading from './shading-light.glsl'
import cellShading from './shading-cell.glsl'
import goochShading from './shading-gooch.glsl'
import lambertShading from './shading-lambert.glsl'

export function createLightShader(fragmentSource: string): string {
  return [
    precision,
    light,
    shading,
    cellShading,
    goochShading,
    lambertShading,
    lightShading,
    fragmentSource
  ].join('\n')
}
