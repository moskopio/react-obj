import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react"
import { FlattenObj, ParsedObj, RawObj } from "src/utils/obj/types"

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
