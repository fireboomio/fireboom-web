interface IndexNodeProps {
  index: string | number
  text: string
}

const IndexNode = ({ index, text }: IndexNodeProps) => {

  return (
    <div className="bg-white flex h-5 w-14 items-center justify-center">
      <span className="rounded-md bg-[#6F6F6F] h-2.5 text-white text-center leading-none text-[10px] w-2.5">{index}</span>
      <span className="text-xs ml-1">{text}</span>
    </div>
  )
}

export default IndexNode