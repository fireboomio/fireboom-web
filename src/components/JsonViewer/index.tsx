import './index.css'

import type { Props } from 'react-json-view-lite'
import { defaultStyles, JsonView } from 'react-json-view-lite'

interface JsonViewerProps extends Omit<Props, 'style'> {}

const JsonViewer = ({ ...props }: JsonViewerProps) => {
  return (
    <JsonView
      {...props}
      style={{
        ...defaultStyles,
        container: 'json-viewer-container'
      }}
    />
  )
}

export default JsonViewer
