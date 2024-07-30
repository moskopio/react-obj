export type Matrix2 = number[]

export const M2 = { determinate }

export function determinate(m: Matrix2): number {
  return m[0] * m[3] - m[1] * m[2]
}
