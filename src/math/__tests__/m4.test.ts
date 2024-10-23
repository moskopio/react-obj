import { describe, expect, test } from 'vitest'
import { M4, Matrix4 } from '../m4'

function expectToBeClose(result: Matrix4, expected: Matrix4): void {
  expect(result.length).toBe(expected.length)
  result.forEach((x, i) =>
    expect(x).toBeCloseTo(expected[i])
  )
}

describe('M4', () => {
  test('gets correct sub matrix', () => {
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
  
  test('calculates inverse matrix', () => {
    const input = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 4, 1
    ]
    const expected = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, -4, 1
    ]
      
    const result = M4.inverse(input)
    expectToBeClose(result, expected)
  })
  
  test('calculates determinate', () => {
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
  
  test('transposes', () => { 
    const input = [
      1,   2,  3,  4,
      5,   6,  7,  8,
      9,  10, 11, 12,
      13, 14, 15, 16
    ]
    const expected = [
      1, 5,  9, 13,
      2, 6, 10, 14,
      3, 7, 11, 15,
      4, 8, 12, 16
    ]
    
    expectToBeClose(M4.transpose(input), expected)
  })
  
  test('translates', () => {
    const expected = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      1, 2, 3, 1
    ]
    
    const result = M4.translation([1, 2, 3])
    expectToBeClose(result, expected)
  })
  
  test('scales', () => {
    const expected = [
      1, 0, 0, 0,
      0, 2, 0, 0,
      0, 0, 3, 0,
      0, 0, 0, 1
    ]
    
    const result = M4.scaling([1, 2, 3])
    expectToBeClose(result, expected)
  })
  
  
  describe('rotation matrix', () => {
    test('for custom axis', () => {
      const expected = [
      -0.333,  0.666,  0.666, 0,
       0.666, -0.333,  0.666, 0,
       0.666,  0.666, -0.333, 0,
       0,          0,      0, 1
      ]
      
      const result = M4.axisRotation([1, 1, 1], Math.PI)
      expectToBeClose(result, expected)
    })
    
    test('for x axis', () => {
      const angle = Math.PI / 2
      const c = Math.cos(angle)
      const s = Math.sin(angle)
      const expected = [
        1,  0,  0, 0,
        0,  c,  s, 0,
        0, -s,  c, 0,
        0,  0,  0, 1
     ]
     
      const result = M4.xRotation(angle)
      expectToBeClose(result, expected)
    })
    
    test('for y axis', () => {
      const angle = Math.PI / 2
      const c = Math.cos(angle)
      const s = Math.sin(angle)
      const expected = [
        c,  0, -s, 0,
        0,  1,  0, 0,
        s,  0,  c, 0,
        0,  0,  0, 1
      ]
      
      const result = M4.yRotation(angle)
      expectToBeClose(result, expected)
    })
    
    test('for z axis', () => {
      const angle = Math.PI / 2
      const c = Math.cos(angle)
      const s = Math.sin(angle)
      const expected = [
        c, s, 0, 0,
       -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
      
      const result = M4.zRotation(angle)
      expectToBeClose(result, expected)
    })
  })
  
})
