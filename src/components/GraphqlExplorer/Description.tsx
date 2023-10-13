import { ReactNode } from "react"

interface DescriptionProps {
  children?: ReactNode
}

const Description = ({ children }: DescriptionProps) => {

  return (
    <div className="mb-4 mt-2 text-sm text-dark-400">
      {children}
    </div>
  )
}

export default Description