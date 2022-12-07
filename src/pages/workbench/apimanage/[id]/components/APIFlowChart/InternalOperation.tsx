import gridImg from './assets/grid.png'
import operationImg from './assets/internal-operation.png'

const InternalOperationChart = () => {
  return (
    <div
      className="text-center"
      style={{
        background: `url("${gridImg}") 22px 22px #F8F9FD repeat`
      }}
    >
      <img className="w-74" src={operationImg} alt="internal operation" />
    </div>
  )
}

export default InternalOperationChart
