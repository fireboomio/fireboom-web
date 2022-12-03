interface ArgumentValueProps {
  name: string
  argChecked?: boolean
  isInput?: boolean
  isEnum?: boolean
  enumValues?: any[]
  isNumber?: boolean
  isObject?: boolean
  value: any
  onChange?: (v: any) => void
}

const ArgumentValue = ({
  name,
  argChecked,
  value,
  onChange,
  isInput,
  isEnum,
  enumValues,
  isNumber,
  isObject
}: ArgumentValueProps) => {
  if (!argChecked) {
    return <></>
  }
  if (isInput || isNumber) {
    return (
      <>
        <span>&apos;</span>
        <input
          value={value}
          autoFocus
          onChange={e => onChange?.(e.target.value)}
          className="border-none outline-none border-gray-500 w-4"
          style={{
            background: 'none',
            borderBottom: `1px solid`
          }}
        />
        <span>&apos;</span>
      </>
    )
  }
  if (isEnum) {
    return (
      <select
        className="outline-none border-gray-500 max-w-40"
        value={value}
        onChange={e => onChange?.(e.target.value)}
      >
        {enumValues?.map(item => (
          <option value={item.value} key={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    )
  }
  if (isObject) {
    return <span className="text-[#397d13]">{`$${name}`}</span>
  }
  return <>unknown</>
}

export default ArgumentValue
