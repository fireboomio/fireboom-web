import gridImg from './assets/grid.png'
import operationImg from './assets/internal-operation.png'

const InternalOperationChart = () => {
  return (
    <div
      className="h-full text-center pt-10"
      style={{
        background: `url("${gridImg}") #F8F9FD repeat`,
        backgroundSize: `22px 22px`
      }}
    >
      <img className="w-80" src={operationImg} alt="internal operation" />
    </div>
  )
}

export default InternalOperationChart
