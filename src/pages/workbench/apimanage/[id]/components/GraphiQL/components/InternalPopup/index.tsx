interface InternalPopupProps {
  value?: boolean
  onChange: (internal: boolean) => void
}

const InternalPopup = ({ value, onChange }: InternalPopupProps) => {
  return (
    <div className="bg-white rounded shadow py-1">
      <div
        className="cursor-pointer flex py-1.5 pr-4 pl-3 items-center hover:bg-gray-100"
        onClick={() => onChange?.(false)}
      >
        <div
          className={`w-1.5 h-1.5 rounded-md mr-3 ${!value ? 'bg-[#41CE88]' : 'bg-[#ACB5DC]'}`}
        />
        公开
      </div>
      <div
        className="cursor-pointer flex py-1.5 pr-4 pl-3 items-center hover:bg-gray-100"
        onClick={() => onChange?.(true)}
      >
        <div className={`w-1.5 h-1.5 rounded-md mr-3 ${value ? 'bg-[#41CE88]' : 'bg-[#ACB5DC]'}`} />
        私有
      </div>
    </div>
  )
}

export default InternalPopup
