import fullscreenIcon from '../assets/fullscreen.svg'
import ExecuteButton from './ExecuteButton'

const GraphiQLToolbar = () => {
  return (
    <div className="graphiql-toolbar">
      <ExecuteButton className="cursor-pointer mr-6" />
      <button className="graphiql-toolbar-btn">@角色</button>
      <button className="graphiql-toolbar-btn">@内部</button>
      <div className="graphiql-toolbar-divider" />
      <button className="graphiql-toolbar-btn">入参指令</button>
      <button className="graphiql-toolbar-btn">响应转换</button>
      <button className="graphiql-toolbar-btn">跨源关联</button>
      <span className="graphiql-toolbar-sequence-chart">时序图</span>
      <img
        className="graphiql-toolbar-fullscreen"
        src={fullscreenIcon}
        width="10"
        height="10"
        alt="toggle fullscreen"
      />
    </div>
  )
}

export default GraphiQLToolbar
