import { ReactElement, useCallback, useRef } from "react"
import { IconFile } from "../components/Icon"
import { useObjLoad } from "../utils/obj-load"
import './FileInput.css'

export function FileInputControls(): ReactElement {
  const onFile = useObjLoad()
  const inputRef = useRef<HTMLInputElement>(null)
  
  const onClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
  <div className='file-input'>
    <IconFile onClick={onClick} />
    <input ref={inputRef} type="file" onChange={onFile} accept=".obj" />
  </div>
  )
}
