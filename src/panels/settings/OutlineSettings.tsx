import { Fragment, ReactElement, useCallback, useContext } from "react"
import { Checkbox } from "src/components/Checkbox"
import { ColorPicker } from "src/components/ColorPicker"
import { Divider } from "src/components/Divider"
import { SettingsPortal } from "src/components/SettingsPortal"
import { Slider } from "src/components/Slider"
import { AppContext } from "src/state/context"
import { Color, createPallette, Pallette } from "src/utils/color"


export function OutlineSettings(): ReactElement {
  const { settings, settingsDispatch } = useContext(AppContext)
  const { outline } = settings
  const { enabled } = outline
  
  const pallette = createPallette(7)
  
  const toggleEnabled = useCallback(
    () => settingsDispatch({ outline: { enabled: !enabled} }), 
    [enabled, settingsDispatch])
    
  return (
    <Fragment>
      <div className="horizontal-setting"> 
        <Checkbox 
            label="Show Outline"
            value={enabled}
            onChange={toggleEnabled}
            color={pallette.getNextColor()}
          />
        <SettingsPortal label="Outline">
          <ToggleControls pallette={pallette} />
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

function ToggleControls(props: Props): ReactElement {
  const { pallette } = props
    const { settings, settingsDispatch } = useContext(AppContext)
    const { outline } = settings
    const { useReverse, useTwoValues} = outline
  
  const toggleUseReverse = useCallback(
    () => settingsDispatch({ outline: { useReverse: !useReverse} }), 
    [useReverse, settingsDispatch])
  const toggleUseTwoValues = useCallback(
    () => settingsDispatch({ outline: { useTwoValues: !useTwoValues} }),
    [useTwoValues, settingsDispatch])
  
  return (
    <Fragment>
      <Checkbox 
        label="Use Reverse"
        value={useReverse}
        onChange={toggleUseReverse}
        color={pallette.getNextColor()}
      />
      <Checkbox 
        label="Use two Values"
        value={useTwoValues}
        onChange={toggleUseTwoValues}
        color={pallette.getNextColor()}
      />
    </Fragment>
  )
}

function VariantAControls(props: Props): ReactElement {
  const { pallette } = props
  const { settings, settingsDispatch } = useContext(AppContext)
  const { outline } = settings
  const { useTwoValues, colorA, weightA } = outline
  
  
  const setWeight = useCallback(
    (weightA: number) => settingsDispatch({ outline: { weightA } }),
    [settingsDispatch]) 
  const setColor = useCallback(
    (colorA: Color) => settingsDispatch({ outline: { colorA } }), 
    [settingsDispatch])
    
    return (
      <Fragment>
        <Divider label={`Setting ${useTwoValues ? "A" : ""}`} />
        <ColorPicker value={colorA} onChange={setColor} />
        <Slider
          label={`Weight: ${weightA.toFixed(3)}`}
          min={0.01}
          max={0.1}
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
  const { outline } = settings
  const { useTwoValues, colorB, weightB } = outline
  
  const setWeight = useCallback(
    (weightB: number) => settingsDispatch({ outline: { weightB } }),
    [settingsDispatch]) 
  const setColor = useCallback(
    (colorB: Color) => settingsDispatch({ outline: { colorB } }), 
    [settingsDispatch])
    
    return useTwoValues ? (
      <Fragment>
        <Divider label="Setting B" />
        <ColorPicker value={colorB} onChange={setColor} />
        <Slider
          label={`Weight: ${weightB.toFixed(3)}`}
          min={0.00}
          max={0.25}
          onChange={setWeight}
          value={weightB}
          defaultValue={0.01}
          color={pallette.getNextColor()}
        />
      </Fragment>
    ) : null
}
