import { M2 } from "./m2"

export type Matrix3 = number[]
export const M3 = { determinate, inverseSum } 

function determinate(m: Matrix3): number {
  const part0 = m[0] * M2.determinate([m[4], m[5], m[7], m[8]])
  const part1 = m[1] * M2.determinate([m[3], m[5], m[6], m[8]])
  const part2 = m[2] * M2.determinate([m[3], m[4], m[6], m[7]])

  return part0 - part1 + part2
}

function inverseSum(m: Matrix3): number {
  const part0 = m[0] * m[4] * m[8]
  const part1 = m[1] * m[5] * m[6] 
  const part2 = m[2] * m[3] * m[7]
  
  const part3 = m[0] * m[5] * m[7]
  const part4 = m[1] * m[3] * m[8]
  const part5 = m[2] * m[4] * m[6]
  
  return part0 + part1 + part2 - part3 - part4 - part5
}

