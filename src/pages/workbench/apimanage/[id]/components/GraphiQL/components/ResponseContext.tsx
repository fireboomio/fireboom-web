import { useEditorContext, useSchemaContext } from '@graphiql/react'
// @ts-ignore
import { formatError } from '@graphiql/toolkit'
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'

interface ResponseState {
  response: string
}

const ResponseContext = createContext<ResponseState>({ response: '' })

export const useResponse = () => {
  return useContext(ResponseContext)
}

interface ResponseWrapperProps {
  children?: ReactNode
}

interface CustomEditorLike {
  getValue: () => string
  setValue: (v: string) => void
}

const ResponseWrapper = ({ children }: ResponseWrapperProps) => {
  const { fetchError, validationErrors } = useSchemaContext({
    nonNull: true,
    caller: ResponseWrapper,
  })
  // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment
  const { initialResponse, responseEditor, setResponseEditor } = useEditorContext({
    nonNull: true,
    caller: ResponseWrapper,
  })
  const codeVal = useRef(initialResponse ?? '')

  useEffect(() => {
    const editor = {
      getValue() {
        return codeVal.current
      },
      setValue(v: string) {
        codeVal.current = v
      },
    }
    setResponseEditor(editor)
  }, [initialResponse, setResponseEditor])

  useEffect(() => {
    if (fetchError) {
      (responseEditor as CustomEditorLike)?.setValue(fetchError)
    }
    if (validationErrors.length > 0) {
      (responseEditor as CustomEditorLike)?.setValue(formatError(validationErrors))
    }
  }, [responseEditor, fetchError, validationErrors])

  return (
    <ResponseContext.Provider value={{ response: codeVal.current }}>
      {children}
    </ResponseContext.Provider>
  )
}

export default ResponseWrapper
