import { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { processObjData } from "src/utils/obj/process"
import { Obj } from "src/utils/obj/types"

const DEFAULT_OBJECT = "/react-obj/stanford-bunny.obj"

export function createEmptyObj(): Obj {
  return {
    raw:         { groups: [] },
    parsed:      { vertices: [], indices: [], definedNormals: [], smoothNormals: [] },
    flat:        { vertices: [], flatNormals: [], definedNormals: [], smoothNormals: [] },
    wireframe:   { vertices: [], flatNormals: [], definedNormals: [], smoothNormals: [] },
    parsingTime: 0,
    boundingBox: [[0, 0, 0], [0, 0, 0]],
    name:        ''
  }
}

interface ObjState {
  obj:    Obj
  setObj: Dispatch<SetStateAction<Obj>>
}

export const ObjContext = createContext<ObjState>({
  obj:    createEmptyObj(),
  setObj: () => {},
})

export function useObjState(): ObjState {
  const [obj, setObj] = useState<Obj>(createEmptyObj())
  
  useEffect(() => {
    async function loadDefaultObject(): Promise<void> {
      const file = await fetch(DEFAULT_OBJECT)
      const objData = await file.text()
      
      const obj = processObjData(objData, 'StandfordBunny.obj')
      setObj(obj)
    }
    loadDefaultObject()
  }, [])
  
  
  return useMemo(() => ({ obj, setObj }),[obj, setObj])
}
