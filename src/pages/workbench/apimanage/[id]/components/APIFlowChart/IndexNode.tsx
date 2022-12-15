interface IndexNodeProps {
  index: string | number
  text: string
}

const IndexNode = ({ index, text }: IndexNodeProps) => {
  return (
    <div
      className="bg-white rounded-sm flex h-5 w-14 items-center justify-center"
      style={{
        border: `0.3px solid rgba(175, 176, 180, 0.6)`
      }}
    >
      <span className="rounded-md bg-[#6F6F6F] h-3 text-white text-center leading-none text-[10px] w-3">
        {index}
      </span>
      <span className="text-xs ml-1">{text}</span>
    </div>
  )
}

export default IndexNode
