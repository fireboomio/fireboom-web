import { Input, Popover } from 'antd'
import { useImmer } from 'use-immer'

interface Props {
  data: string
}

const TYPES = [
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

function PopoverContent() {
  const [types, setTypes] = useImmer(TYPES)

  function onSearch(value: string) {
    setTypes(types.filter((type) => type.toLowerCase().includes(value)))
  }

  return (
    <>
      <Search
        className="h-4"
        enterButton={false}
        size="small"
        placeholder="Basic usage"
        onSearch={onSearch}
      />
      <div className="h-1px w-full border border-solid border-[#5F6269] border-opacity-10 my-2 mt-3" />
      <ul>
        {types.map((type, idx) => (
          <li key={idx}>
            <div className="my-2 cursor-pointer">{type}</div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function ModelDesignerColumnType({ data }: Props) {
  return (
    <div className="h-6 w-full max-w-150px hover:bg-[#F8F8F9] cursor-pointer">
      <Popover content={PopoverContent} title="字段类型" trigger="click">
        {data}
      </Popover>
    </div>
  )
}
