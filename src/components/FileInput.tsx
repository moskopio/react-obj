import { ChangeEvent, ReactElement, useCallback, useRef } from "react"
import './FileInput.css'

interface Props {
  label:      string
  onFileLoad: (file: string) => void
}

export function FileInput(props: Props): ReactElement {
  const { label, onFileLoad } = props
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = function(event: ProgressEvent<FileReader>) {
        const result = event?.target?.result
        
        if (typeof result === 'string') {
          onFileLoad(result)
        }
        
      }
      reader.readAsText(file)
    }
  }
  
  const onClick = useCallback(() => {
    inputRef.current?.click()
  }, [])
  
  return (
    <div className="file-input" onClick={onClick}>
      <div className="file-input-icon">
        <input ref={inputRef} type="file" onChange={onFile} />
      </div>
      <div className="file-input-label">{label}</div>
    </div>
  )
}
