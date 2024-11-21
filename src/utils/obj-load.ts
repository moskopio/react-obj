import { ChangeEvent, useCallback, useContext } from "react"
import { ObjContext } from "src/state/obj"
import { processObjData } from "src/utils/obj/process"

type ObjLoad = (event: ChangeEvent<HTMLInputElement>) => void

export function useObjLoad(): ObjLoad {
  const { setObj } = useContext(ObjContext)
  
  const onObjLoad = useCallback((data: string, name: string) => {
    const obj = processObjData(data, name)
    setObj(obj)
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
