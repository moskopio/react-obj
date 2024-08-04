import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react"
import { RawObj } from "../obj/read"
import { ParsedObj } from "../obj/parse"
import { FlattenObj } from "../obj/flatten"

const EMPTY_OBJ: Obj = {
  raw:        { groups: [] },
  parsed:     { vertices: [], indices: [], definedNormals: [], smoothNormals: [] },
  flat:       { vertices: [], flatNormals: [], definedNormals: [], smoothNormals: [] },
  wireframe:  { vertices: [], flatNormals: [], definedNormals: [], smoothNormals: [] },
  parsingTime: 0
}

export interface Obj {
  raw:         RawObj
  parsed:      ParsedObj
  flat:        FlattenObj
  wireframe:   FlattenObj
  parsingTime: number
}


interface ObjState {
  obj:    Obj
  setObj: Dispatch<SetStateAction<Obj>>
}

export const ObjContext = createContext<ObjState>({
  obj:      EMPTY_OBJ,
  setObj:   () => {},
})

export function useObjState(): ObjState {
  const [obj, setObj] = useState<Obj>(EMPTY_OBJ)
  
  return useMemo(() => ({ obj, setObj }),[obj, setObj]) 
}
