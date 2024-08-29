import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "../../components/Checkbox"
import { ColorPicker } from "../../components/ColorPicker"
import { Divider } from "../../components/Divider"
import { Slider } from "../../components/Slider"
import { AppContext } from "../../state/context"
import { Color, createPallette, Pallette } from "../../utils/color"
import { SettingsPortal } from "../../components/SettingsPortal"

export function GridSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { grid } = settings
  const { enabled } = grid
  
  const pallette = createPallette(8)
  
  const toggleEnabled = useCallback(
    () => settingsDispatch({ grid: { enabled: !enabled} }), 
    [enabled, settingsDispatch])
    
  return (
    <Fragment>
      <div className='horizontal-setting'>
        <Checkbox 
            label="Show Grid"
            value={enabled}
            onChange={toggleEnabled}
            color={pallette.getNextColor()}
          />
        <SettingsPortal label='Grid'>
          <CommonControls pallette={pallette} />
          <VariantAControls pallette={pallette} />
          <VariantBControls pallette={pallette} />
        </SettingsPortal>
      </div>
    </Fragment>
  )
}

interface Props {
  pallette: Pallette
}

function CommonControls(props: Props): ReactElement {
  const { pallette } = props
    const { settings, settingsDispatch } = useContext(AppContext)
    const { grid } = settings
    const { divisions, useTwoValues } = grid
  
  const toggleUseTwoValues = useCallback(
    () => settingsDispatch({ grid: { useTwoValues: !useTwoValues} }),
    [useTwoValues, settingsDispatch])
    
  const setDivisions = useCallback(
    (divisions: number) => settingsDispatch({ grid: { divisions: Math.floor(divisions) } }),
    [settingsDispatch]) 
  
  return (
    <Fragment>
      <Checkbox 
        label="Use two Values"
        value={useTwoValues}
        onChange={toggleUseTwoValues}
        color={pallette.getNextColor()}
      />
      <Slider
        label={`Divisions: ${Math.floor(divisions)}`}
        min={1.0}
        max={16.0}
        onChange={setDivisions}
        value={divisions}
        defaultValue={4.0}
        color={pallette.getNextColor()}
      />
    </Fragment>
  )
}

function VariantAControls(props: Props): ReactElement {
  const { pallette } = props
  const { settings, settingsDispatch } = useContext(AppContext)
  const { grid } = settings
  const { useTwoValues, colorA, weightA } = grid
  
  const setWeight = useCallback(
    (weightA: number) => settingsDispatch({ grid: { weightA } }),
    [settingsDispatch]) 
  const setColor = useCallback(
    (colorA: Color) => settingsDispatch({ grid: { colorA } }), 
    [settingsDispatch])
    
  return (
    <Fragment>
      <Divider label={`Line ${useTwoValues ? 'A' : ''}`} />
      <ColorPicker value={colorA} onChange={setColor} />
      <Slider
        label={`Weight: ${weightA.toFixed(3)}`}
        min={0.01}
        max={1}
        onChange={setWeight}
        value={weightA}
        defaultValue={0.01}
        color={pallette.getNextColor()}
      />
    </Fragment>
  )
}

function VariantBControls(props: Props): ReactElement | null {
  const { pallette } = props
  const { settings, settingsDispatch } = useContext(AppContext)
  const { grid } = settings
  const { useTwoValues, colorB, weightB } = grid
  
  const setWeight = useCallback(
    (weightB: number) => settingsDispatch({ grid: { weightB } }),
    [settingsDispatch]) 
  const setColor = useCallback(
    (colorB: Color) => settingsDispatch({ grid: { colorB } }), 
    [settingsDispatch])
    
  return useTwoValues ? (
    <Fragment>
      <Divider label={`Line B`} />
      <ColorPicker value={colorB} onChange={setColor} />
      <Slider
        label={`Weight: ${weightB.toFixed(2)}`}
        min={0.01}
        max={1}
        onChange={setWeight}
        value={weightB}
        defaultValue={0.01}
        color={pallette.getNextColor()}
      />
    </Fragment>
  ) : null
}
