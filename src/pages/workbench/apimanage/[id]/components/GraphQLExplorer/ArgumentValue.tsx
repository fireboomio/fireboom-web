interface ArgumentValueProps {
  name: string
  isChecked?: boolean
  isArg?: boolean
  isInput?: boolean
  isEnum?: boolean
  enumValues?: () => { label: string; value: any }[]
  isNumber?: boolean
  isObject?: boolean
  value: any
  onChange?: (v: any) => void
}

const ArgumentValue = ({
  name,
  isChecked,
  isArg,
  value,
  onChange,
  isInput,
  isEnum,
  enumValues,
  isNumber,
  isObject
}: ArgumentValueProps) => {
  if (!isChecked) {
    return <></>
  }
  if (isArg) {
    return <span className="text-[#397d13]">{`$${name}`}</span>
  }
  if (isInput || isNumber) {
    return (
      <>
        {!isNumber && <span>&quot;</span>}
        <input
          value={value}
          autoFocus
          onChange={e => onChange?.(e.target.value)}
          className="border-none outline-none border-gray-500 w-10"
          style={{
            background: 'none',
            borderBottom: `1px solid`
          }}
        />
        {!isNumber && <span>&quot;</span>}
      </>
    )
  }
  if (isEnum) {
    return (
      <select
        className="outline-none border-gray-500 max-w-30"
        value={value}
        onChange={e => onChange?.(e.target.value)}
      >
        {enumValues?.()?.map(item => (
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
