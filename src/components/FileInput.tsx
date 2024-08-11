import { ChangeEvent, ReactElement, useCallback, useRef } from "react"
import './FileInput.css'

interface Props {
  label:  string
  onFile: (event: ChangeEvent<HTMLInputElement>) => void
}

export function FileInput(props: Props): ReactElement {
  const { label, onFile } = props
  
  const inputRef = useRef<HTMLInputElement>(null)
  const onClick = useCallback(() => {
    inputRef.current?.click()
  }, [])
  
  return (
    <div className="file-input" onClick={onClick}>
      <div className="file-input-icon">
        <input ref={inputRef} type="file" onChange={onFile} accept=".obj" />
      </div>
      <div className="file-input-label">{label}</div>
    </div>
  )
}
