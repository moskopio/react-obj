import light from './light.glsl'
import precision from './precision.glsl'
import cellShading from './shading-cell.glsl'
import goochShading from './shading-gooch.glsl'
import lambertShading from './shading-lambert.glsl'
import lightShading from './shading-light.glsl'
import shading from './shading.glsl'
import shadow from './shadow.glsl'

export function createLightShader(fragmentSource: string): string {
  return [
    precision,
    light,
    shading,
    shadow,
    cellShading,
    goochShading,
    lambertShading,
    lightShading,
    fragmentSource
  ].join('\n')
}

export function createShadowOnlyShader(fragmentSource: string): string {
  return [
    precision,
    shadow,
    fragmentSource,
  ].join('\n')
}

