import { ChangeEvent, useCallback, useContext } from "react"
import { ObjContext } from "../state/obj"
import { flattenParsedObj } from "../utils/obj/flatten"
import { parseObj } from "../utils/obj/parse"
import { readObj } from "../utils/obj/read"
import { wireframeFlattenObj } from "../utils/obj/wireframe"

export function useObjLoad(): (event: ChangeEvent<HTMLInputElement>) => void {
  const { setObj } = useContext(ObjContext)
  
  const onObjLoad = useCallback((data: string, name: string) => {
    const tick = Date.now()
    const raw = readObj(data)
    const parsed = parseObj(raw)
    const flat = flattenParsedObj(parsed)
    const wireframe = wireframeFlattenObj(flat)
    const parsingTime = Date.now() - tick
    
    setObj({ name, raw, parsed, flat, wireframe, parsingTime })
  }, [setObj])
  
  return useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    
    if (file) {
      const reader = new FileReader()
      reader.onload = function(event: ProgressEvent<FileReader>) {
        const result = event?.target?.result
        
        if (typeof result === 'string') {
          onObjLoad(result, file.name)
        }
        
      }
      reader.readAsText(file)
    }
  }, [])
}
