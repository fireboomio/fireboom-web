interface Props {
  data: string
  onClick: () => void
}

export default function ModelDesignerColumnType({ data, onClick }: Props) {
  return (
    <div className="h-6 w-full max-w-150px hover:bg-[#F8F8F9] cursor-pointer" onClick={onClick}>
      {data}
    </div>
  )
}
