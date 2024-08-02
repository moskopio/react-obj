import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"

const DELAY_TIME = 500

export function useDelayedValue<T>(value: T, delay = DELAY_TIME): T {
  const [delayed, setDelayed] = useState(value)
  const id = useRef<number>(-1)

  useEffect(() => {
    clearTimeout(id.current)
    id.current = setTimeout(update, delay)

    function update(): void {
      setDelayed(value)
    }
  }, [value, delay])

  return delayed
}

type D<T> = Dispatch<T>
type A<T> = SetStateAction<T>

export function useDelayedUpdate<T>(dispatch: D<A<T>>, initialValue: A<T>, delay = DELAY_TIME): D<A<T>> {
  const [value, setValue] = useState<A<T>>(initialValue)
  const id = useRef<number>(-1)
  
  useEffect(() => {
    clearTimeout(id.current)
    id.current = setTimeout(update, delay)
  
    function update(): void {
      dispatch(value)
    }
  }, [value, delay, initialValue])
  
  return useCallback((v: A<T>) => {
    setValue(v)
  }, [setValue])
}
