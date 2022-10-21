import { useEffect } from 'react'
import { useImmer } from 'use-immer'

const usePersistentState = <T>(
  key: string,
  initialValue: T,
  resetLocalStorage = false
): [T, (t: T | null) => void] => {
  const [storedValue, setStoredValue] = useImmer<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return !item || resetLocalStorage ? initialValue : (JSON.parse(item) as T)
    } catch (error) {
      return initialValue
    }
  })

  const updateStoredValue = (value: T | null) => {
    if (value) {
      setStoredValue(value)
    } else {
      window.localStorage.removeItem(key)
    }
  }

  // local storage is automatically set when state is updated.
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue))
  }, [key, storedValue])

  return [storedValue, updateStoredValue]
}

export default usePersistentState
