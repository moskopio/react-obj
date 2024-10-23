import { degToRad, radToDeg } from "../angles"
import { describe, expect, test } from "vitest"

describe('angles', () => {
  test('degToRad converts angles correctly', () => {
    expect(degToRad(0)).toBeCloseTo(0)
    expect(degToRad(Infinity)).toBeCloseTo(Infinity)
    expect(degToRad( 45)).toBeCloseTo(Math.PI * 1 / 4)
    expect(degToRad( 90)).toBeCloseTo(Math.PI * 2 / 4)
    expect(degToRad(135)).toBeCloseTo(Math.PI * 3 / 4)
    expect(degToRad(180)).toBeCloseTo(Math.PI * 4 / 4)
    expect(degToRad(225)).toBeCloseTo(Math.PI * 5 / 4)
    expect(degToRad(270)).toBeCloseTo(Math.PI * 6 / 4)
    expect(degToRad(315)).toBeCloseTo(Math.PI * 7 / 4)
    expect(degToRad(360)).toBeCloseTo(Math.PI * 8 / 4)
  })
  
  test('radToDeg converts angles correctly', () => {
    expect(radToDeg(0)).toBeCloseTo(0)
    expect(radToDeg(Infinity)).toBeCloseTo(Infinity)
    expect(radToDeg(Math.PI * 1 / 4)).toBeCloseTo( 45)
    expect(radToDeg(Math.PI * 2 / 4)).toBeCloseTo( 90)
    expect(radToDeg(Math.PI * 3 / 4)).toBeCloseTo(135)
    expect(radToDeg(Math.PI * 4 / 4)).toBeCloseTo(180)
    expect(radToDeg(Math.PI * 5 / 4)).toBeCloseTo(225)
    expect(radToDeg(Math.PI * 6 / 4)).toBeCloseTo(270)
    expect(radToDeg(Math.PI * 7 / 4)).toBeCloseTo(315)
    expect(radToDeg(Math.PI * 8 / 4)).toBeCloseTo(360)
  })
})
