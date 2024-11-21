import { getBoundingBox } from "./bounding-box"
import { flattenParsedObj } from "./flatten"
import { parseObj } from "./parse"
import { readObj } from "./read"
import { Obj } from "./types"
import { wireframeFlattenObj } from "./wireframe"

export function processObjData(data: string, name: string): Obj {
  const tick = Date.now()
  const raw = readObj(data)
  const parsed = parseObj(raw)
  const flat = flattenParsedObj(parsed)
  const wireframe = wireframeFlattenObj(flat)
  const parsingTime = Date.now() - tick
  const boundingBox = getBoundingBox(flat.vertices)
  
  return { name, raw, parsed, flat, wireframe, parsingTime, boundingBox }
}
