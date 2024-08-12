import { ReactElement } from "react"
import './Icon.css'

interface Props {
  onClick: () => void
}

export function IconCamera(props: Props): ReactElement {
  return <div className='icon-camera' onClick={props?.onClick} />
}

export function IconInfo(props: Props): ReactElement {
  return <div className='icon-info' onClick={props?.onClick} />
}

export function IconSettings(props: Props): ReactElement {
  return <div className='icon-settings' onClick={props?.onClick} />
}

export function IconFile(props: Props): ReactElement {
  return <div className='icon-file' onClick={props?.onClick} />
}

export function IconLight(props: Props): ReactElement {
  return <div className='icon-light' onClick={props?.onClick} />
}
