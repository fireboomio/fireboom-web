import { WarningOutlined } from '@ant-design/icons'
import type { InputRef } from 'antd'
import { Input, Popover } from 'antd'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'

interface Props {
  data: string | undefined
  className?: string
  onBlur: (v: string) => void
  initialIsEditing?: boolean
  placeholder?: string
  validation?: (v: string) => { result: boolean; errorMessage?: string }
}

const NormalInputCell = ({
  data: initialData,
  className,
  onBlur,
  initialIsEditing,
  placeholder,
  validation
}: Props) => {
  const [isEditing, setIsEditing] = useImmer<boolean>(initialIsEditing ?? false)

  const [data, setData] = useImmer<string>(initialData ?? '')

  const [inputStatus, setInputStatus] = useImmer<'error' | 'warning' | ''>('')

  const [errorPrompt, setErrorPrompt] = useImmer<React.ReactNode>(<></>)

  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    setData(initialData ?? '')
  }, [initialData])

  const commit = () => {
    const validationResult = validation && data ? validation(data) : { result: true }
    if (!validationResult.result) {
      setInputStatus('error')
      inputRef.current?.focus({ cursor: 'all' })
      setErrorPrompt(errorPromptContainer(validationResult.errorMessage ?? '输入不合法！'))
      return false
    }
    setIsEditing(false)
    onBlur(data)
  }

  const cancel = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setData(value)
    setInputStatus('')
    setErrorPrompt(<></>)
  }

  const changeIsEditing = () => setIsEditing(!isEditing)

  const errorPromptContainer = (errorMessage: string) => {
    return (
      <Popover content={<div className="text-red-500">{errorMessage}</div>} trigger="hover">
        <WarningOutlined />
      </Popover>
    )
  }

  const content = (
    <div
      className={`h-7 hover:bg-[#F8F8F9] ${
        className ?? ''
      } overflow-hidden overflow-ellipsis max-w-full`}
      onClick={changeIsEditing}
    >
      {data ? data : <div className="text-[#AFB0B4] w-max">{placeholder}</div>}
    </div>
  )

  return (
    <div className="h-7">
      {isEditing ? (
        <Input
          className={className}
          autoFocus
          status={inputStatus}
          size="small"
          value={data}
          onChange={handleChange}
          placeholder={placeholder}
          prefix={errorPrompt}
          onBlur={commit}
          onPressEnter={commit}
          onKeyUp={cancel}
        />
      ) : (
        <div
          className={`h-7 hover:bg-[#F8F8F9] ${
            className ?? ''
          } overflow-hidden overflow-ellipsis max-w-full`}
          onClick={changeIsEditing}
        >
          {data ? (
            data.length > 10 ? (
              <Popover content={data}>{data}</Popover>
            ) : (
              data
            )
          ) : (
            <div className="text-[#AFB0B4] w-max">{placeholder}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default NormalInputCell
