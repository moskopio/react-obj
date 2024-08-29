import { Vec3 } from "./math/v3"
import { Vec4 } from "./math/v4"

export type Color = [r: number, g: number, b: number]

export function colorToVec3(color: number): Vec3 {
  const r = (color >>> 16) / 255
  const g = (color >>> 8 & 0xFF) / 255
  const b = (color & 0xFF) / 255
  return [r, g, b]
}

export function colorToVec4(color: number): Vec4 {
  const r = (color >>> 24) / 255
  const g = (color >>> 16 & 0xFF) / 255
  const b = (color >>> 8 & 0xFF) / 255
  const a = (color & 0xFF) / 255
  return [r, g, b, a]
}

export function vec3ToCSSColor(color: Vec3): string {
  return '#' + color.map(p => p.toString(16).toLocaleUpperCase()).map(p => p.length < 2 ? `0${p}` : p).join('')
}

export function vec3ToShaderColor(color: Color): Vec3 {
  return color.map(p => p / 255) as Vec3
}


export const PASTEL_COLORS = {
  pancho:   '#EFD5A5',
  mongoose: '#BDA67D',
  gray:     '#A6B4B6',
  hai:      '#8A9BAC',
  sirocco:  '#707E7D',
  locust:   '#ABAE93',
  mist:     '#D7DAC5',
  juniper:  '#729494',
  givry:    '#F7D8BE',
  mojo:     '#BF5C38',
  rainee:   '#B2C99E',
  lynch:    '#628090',
 } as const

export interface Pallette {
  getNextColor: () => string
}

export function createPallette(index: number = 0): Pallette {
  let counter = index
  const colors = Object.values(PASTEL_COLORS)
  
  return { getNextColor }
  
  function getNextColor(): string {
    const color = colors[counter]
    counter = ++counter < colors.length ? counter: 0
    
    return color
  }
}
