type Props = {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
const Log: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-[calc(306px_-_28px)] overflow-auto">
      <pre className="h-full">{children}</pre>
    </div>
  )
}

export default Log
