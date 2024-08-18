import { ReactElement } from "react"
import './Divider.css'

interface Props {
  label?: string
}

export function Divider(props: Props): ReactElement {
  const { label = '' } = props
  
  return (
    <div className='divider' style={{ gap: label ? '5px' : '0'}}>
      {label}
    </div>
  )
}
