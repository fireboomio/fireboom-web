interface ArgumentValueProps {
  argChecked?: boolean
}

const ArgumentValue = ({ argChecked }: ArgumentValueProps) => {

  return argChecked ? <span className="text-[#397d13]">{`$aaa`}</span> : (
    <div></div>
  )
}

export default ArgumentValue