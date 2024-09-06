import { Fragment, ReactElement, useCallback, useContext, useRef } from "react"
import { Checkbox } from "../../components/Checkbox"
import { SettingsPortal } from "../../components/SettingsPortal"
import { Slider } from "../../components/Slider"
import { AppContext } from "../../state/context"
import { createPallette } from "../../utils/color"
import { Vec2, Vec3 } from "../../utils/math/v3"
import { Divider } from "../../components/Divider"

export function PointsSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { points } = settings
  const { enabled, useLight } = points
  
  const pallette = createPallette(3)
  
  const toggleEnabled = useCallback(
    (enabled: boolean) => settingsDispatch({ points: { enabled } }), 
    [settingsDispatch])
    
  const toggleUseLight = useCallback(
    (useLight: boolean) => settingsDispatch({ points: { useLight } }), 
    [settingsDispatch])
    
  return (
    <Fragment>
      <div className="horizontal-setting">
        <Checkbox 
            label="Show Points"
            value={enabled}
            onChange={toggleEnabled}
            color={pallette.getNextColor()}
          />
        <SettingsPortal label="Points">
        <Checkbox 
            label="Use Light"
            value={useLight}
            onChange={toggleUseLight}
            color={pallette.getNextColor()}
          />
          <Divider label="Movement" />
          <MovementControls />
          <Divider label="Size" />
          <SizeControls />
        </SettingsPortal>
      </div>
    </Fragment>
  )
}

function MovementControls(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { points } = settings
  const {movement } = points
  const movementRef = useRef(movement)
  
  const pallette = createPallette(2)
  
  const onXMovementChange = useCallback((v: number) => {
    const prev = movementRef.current
    const movement = [v, prev[1], prev[2]] as Vec3
    movementRef.current = movement
    settingsDispatch({ points: { movement } })
  },[settingsDispatch, movementRef])
  
  const onYMovementChange = useCallback((v: number) => {
    const prev = movementRef.current
    const movement = [prev[0], v, prev[2]] as Vec3
    movementRef.current = movement
    settingsDispatch({ points: { movement } })
  },[settingsDispatch, movementRef])
  
  const onZMovementChange = useCallback((v: number) => {
    const prev = movementRef.current
    const movement = [prev[0], prev[1], v] as Vec3
    movementRef.current = movement
    settingsDispatch({ points: { movement } })
  },[settingsDispatch, movementRef])
  
  return (
    <Fragment>
      <Slider 
        label={`X ${movement[0].toFixed(2)}`}
        value={movement[0]}
        min={0}
        max={2}
        defaultValue={0}
        onChange={onXMovementChange}
        color={pallette.getNextColor()}
      />
      <Slider 
        label={`Y ${movement[1].toFixed(2)}`}
        value={movement[1]}
        min={0}
        max={2}
        defaultValue={0}
        onChange={onYMovementChange}
        color={pallette.getNextColor()}
      />
      <Slider 
        label={`Z ${movement[2].toFixed(2)}`}
        value={movement[2]}
        min={0}
        max={2}
        defaultValue={0}
        onChange={onZMovementChange}
        color={pallette.getNextColor()}
      />
    </Fragment>
  )
}

function SizeControls(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { points } = settings
  const { size } = points
  const sizeRef = useRef(size)
  
  const pallette = createPallette(4)
  
  const onMinSizeUpdate = useCallback((v: number) => {
    const prev = sizeRef.current
    const size = [v, prev[1]] as Vec2
    sizeRef.current = size
    settingsDispatch({ points: { size } })
  },[settingsDispatch, sizeRef])
  const onMaxSizeUpdate = useCallback((v: number) => {
    const prev = sizeRef.current
    const size = [prev[0], v] as Vec2
    sizeRef.current = size
    settingsDispatch({ points: { size } })
  },[settingsDispatch, sizeRef])
  
  return (
  <Fragment>
    <Slider 
      label={`Min ${size[0].toFixed(2)}`}
      value={size[0]}
      min={1}
      max={20}
      defaultValue={5}
      onChange={onMinSizeUpdate}
      color={pallette.getNextColor()}
    />
    <Slider 
      label={`Max ${size[1].toFixed(2)}`}
      value={size[1]}
      min={0}
      max={20}
      defaultValue={10}
      onChange={onMaxSizeUpdate}
      color={pallette.getNextColor()}
    />
  </Fragment>
  )
}
