import { describe, expect, test } from 'vitest'
import { M4 } from '../m4'



describe('M4', () => {
  test('getSubMatrix gets correct parts', () => {
    const m = [
      0, 1, 2, 3,
      4, 5, 6, 7,
      8, 9, 10, 11,
      12, 13, 14, 15]

    expect(M4.getSubMatrix(m, 0, 0)).toStrictEqual([5, 6, 7, 9, 10, 11, 13, 14, 15])
    expect(M4.getSubMatrix(m, 0, 1)).toStrictEqual([1, 2, 3, 9, 10, 11, 13, 14, 15])
    expect(M4.getSubMatrix(m, 1, 1)).toStrictEqual([0, 2, 3, 8, 10, 11, 12, 14, 15])
    expect(M4.getSubMatrix(m, 2, 2)).toStrictEqual([0, 1, 3, 4, 5, 7, 12, 13, 15])
    expect(M4.getSubMatrix(m, 2, 2)).toStrictEqual([0, 1, 3, 4, 5, 7, 12, 13, 15])
    expect(M4.getSubMatrix(m, 3, 0)).toStrictEqual([4, 5, 6, 8, 9, 10, 12, 13, 14])
    expect(M4.getSubMatrix(m, 0, 3)).toStrictEqual([1, 2, 3, 5, 6, 7, 9, 10, 11])
  })
  
  test('inverse gets correct matrix', () => {
    const input = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 4, 1
    ]
    const result = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, -4, 1
    ]
    
    expect(M4.inverse(input)).toStrictEqual(result)
  })
    
  test('calculates determinate correctly', () => {
    const m0 = [ 1,  2,  3,  4,
                 5,  6,  7,  8,
                 9, 10, 11, 12,
                13, 14, 15, 16]
    expect(M4.determinate(m0)).toEqual(0)
    const m1 = [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]
    expect(M4.determinate(m1)).toEqual(1)
    const m2 = [4,  3,  2, 2,
                0,  1, -3, 3,
                0, -1,  3, 3,
                0,  3,  1, 1]
    expect(M4.determinate(m2)).toEqual(-240)
  })
})
