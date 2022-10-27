import _debounce from 'lodash/debounce'
import type { DependencyList } from 'react'
import { useCallback, useEffect, useState } from 'react'

export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => {
      clearTimeout(timer)
    }
  }, [delay, value])
  return debouncedValue
}

export function useDebounceMemo<T>(
  factory: () => T,
  debounce: number,
  deps: DependencyList | undefined
): T {
  const [state, setState] = useState(factory())

  const debouncedSetState = useCallback(_debounce(setState, debounce), [])

  useEffect(() => {
    debouncedSetState(factory())
  }, deps)

  return state
}
