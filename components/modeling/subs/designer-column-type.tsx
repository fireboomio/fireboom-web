import { Input, Popover } from 'antd'
import { useCallback } from 'react'
import { useImmer } from 'use-immer'

interface Props {
  data: string
  idx?: number
}

const BASE_TYPES = [
  'String',
  'Boolean',
  'Int',
  'BigInt',
  'Float',
  'Decimal',
  'DateTime',
  'Json',
  'Bytes',
]

const { Search } = Input

interface PropoverProps {
  onClick: (value: string) => void
}

function PopoverContent({ onClick }: PropoverProps) {
  const [types, setTypes] = useImmer(BASE_TYPES)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTypes(types.filter((type) => type.toLowerCase().includes(e.target.value)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Search
        autoFocus
        className="h-4"
        size="small"
        placeholder="Basic usage"
        onChange={onChange}
      />
      <div className="h-1px w-full border border-solid border-[#5F6269] border-opacity-10 my-2 mt-3" />
      <ul>
        {types.map((type, idx) => (
          <li key={idx}>
            <div className="my-2 cursor-pointer hover:bg-[#F8F8F9]" onClick={() => onClick(type)}>
              {type}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function ModelDesignerColumnType({ data }: Props) {
  const [value, setValue] = useImmer(data)
  const [visible, setVisible] = useImmer(false)
  const [isHovering, setIsHovering] = useImmer(false)

  function handleSelect(value: string) {
    setValue(value)
    setVisible(false)
    setIsHovering(false)
  }

  function handleClick(visible: boolean) {
    setVisible(visible)
    setIsHovering(visible)
  }

  return (
    <>
      <div
        // tabIndex={idx}
        className="h-6 w-full max-w-150px hover:bg-[#F8F8F9] cursor-pointer"
        style={isHovering ? { backgroundColor: '#F8F8F9' } : {}}
        onClick={() => handleClick(!visible)}
        onMouseLeave={() => setIsHovering(visible)}
        // onBlur={() => {
        //   setIsHovering(false)
        //   setVisible(false)
        // }}
      >
        <span style={BASE_TYPES.includes(value) ? { color: '#1BB659' } : { color: '#99109B' }}>
          {value}
        </span>
      </div>

      <Popover
        placement="right"
        content={PopoverContent({ onClick: handleSelect })}
        title="字段类型"
        visible={visible}
      />
    </>
  )
}
