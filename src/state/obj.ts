import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react"
import { RawObj } from "../utils/obj/read"
import { ParsedObj } from "../utils/obj/parse"
import { FlattenObj } from "../utils/obj/flatten"

export function createEmptyObj(): Obj {
  return {
    raw:         { groups: [] },
    parsed:      { vertices: [], indices: [], definedNormals: [], smoothNormals: [], boundingBox: [[0,0,0], [0,0,0]] },
    flat:        { vertices: [], flatNormals: [], definedNormals: [], smoothNormals: [] },
    wireframe:   { vertices: [], flatNormals: [], definedNormals: [], smoothNormals: [] },
    parsingTime: 0,
    name:        ''
  }
}

export interface Obj {
  raw:         RawObj
  parsed:      ParsedObj
  flat:        FlattenObj
  wireframe:   FlattenObj
  parsingTime: number
  name:        string
}


interface ObjState {
  obj:    Obj
  setObj: Dispatch<SetStateAction<Obj>>
}

export const ObjContext = createContext<ObjState>({
  obj:      createEmptyObj(),
  setObj:   () => {},
})

export function useObjState(): ObjState {
  const [obj, setObj] = useState<Obj>(createEmptyObj())
  
  return useMemo(() => ({ obj, setObj }),[obj, setObj]) 
}
