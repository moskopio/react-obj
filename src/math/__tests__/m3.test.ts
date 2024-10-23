import { describe, expect, test } from "vitest"
import { M3 } from "../m3"

describe('M3', () => {
  test('calculates inverse sum correctly', () => { 
    const m = [
      1, 0, 0,
      0, 1, 0,
      0, 4, 1]
    expect(M3.inverseSum(m)).toEqual(1)
    
    const m2 = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 4,
    ]
    expect(M3.inverseSum(m2)).toEqual(4)
  })
  
  test('calculates determinate correctly', () => {
    expect(M3.determinate([1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(0)
    expect(M3.determinate([1, 0, 0, 0, 1, 0, 0, 0, 1])).toEqual(1)
    expect(M3.determinate([1, 2, -1, 5, 1, 7, 12, 8, 1])).toEqual(75)
    expect(M3.determinate([1, 0, 0, 0, 1, 0,0, 0, 4])).toEqual(4)
  })
})
