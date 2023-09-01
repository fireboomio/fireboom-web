import type { JsonViewProps } from '@uiw/react-json-view'
import ReactJsonView from '@uiw/react-json-view'
import { lightTheme } from '@uiw/react-json-view/light'
import { TriangleArrow } from '@uiw/react-json-view/triangle-arrow'

// interface JsonViewerProps extends Omit<Props, 'style'> {}

const JsonViewer = ({
  data,
  collapsed
}: Pick<JsonViewProps<object>, 'collapsed'> & { data: object }) => {
  return (
    <ReactJsonView
      value={data}
      enableClipboard
      collapsed={collapsed}
      components={{
        arrow: <TriangleArrow />
      }}
      style={lightTheme}
    />
  )
}

export default JsonViewer
