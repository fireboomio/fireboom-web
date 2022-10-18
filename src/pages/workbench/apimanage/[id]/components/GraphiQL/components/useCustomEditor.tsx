import { useEffect, useRef } from 'react'

export interface CustomEditorLike {
  getValue: () => string
  setValue: (v: string) => void
}

export default function useCustomEditor(initialValue?: string) {
  const codeVal = useRef(initialValue ?? '')

  const editorRef = useRef<CustomEditorLike>()

  useEffect(() => {
    editorRef.current = {
      getValue() {
        return codeVal.current
      },
      setValue(v: string) {
        codeVal.current = v
      }
    }
  }, [])
  return { editorRef }
}
