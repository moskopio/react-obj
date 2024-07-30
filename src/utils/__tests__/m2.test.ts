import { describe, expect, test } from "vitest"
import { M2 } from "../m2"

describe('M2', () => {
  test('calculates determinate correctly', () => {
    expect(M2.determinate([4, 7, 2, 6])).toEqual(10)
    expect(M2.determinate([3, 4, 6, 8])).toEqual(0)
    expect(M2.determinate([1, 2, 3, 4])).toEqual(-2)
  })
})
