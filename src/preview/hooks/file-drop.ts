import { useCallback, useContext, useEffect } from "react"
import { ObjContext } from "src/state/obj"
import { processObjData } from "src/utils/obj/process"

const EXPECTED_FILE_TYPE = 'model/obj'

export function useFileDrop(): void {
  const { setObj } = useContext(ObjContext)
  const onObjLoad = useCallback((data: string, name: string) => {
    const obj = processObjData(data, name)
    setObj(obj)
  }, [setObj])
  
  useEffect(() => {
    window.addEventListener('drop', fileDropHandler)
    window.addEventListener('dragover', onDragOver)
        
    function onDragOver(event: DragEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    
    function fileDropHandler(event: DragEvent): void {
      event.preventDefault()
      event.stopImmediatePropagation()
      
      const items = event.dataTransfer?.items
      if (items && items.length > 0) {
        const file = items[0].getAsFile()
        
        if (EXPECTED_FILE_TYPE === file?.type) {
          const reader = new FileReader()
          reader.onload = function(event: ProgressEvent<FileReader>) {
            const result = event?.target?.result
            
            if (typeof result === 'string') {
              onObjLoad(result, file.name)
            }
          }
        reader.readAsText(file)
        }
      }
    }
    
  },[onObjLoad])

}
