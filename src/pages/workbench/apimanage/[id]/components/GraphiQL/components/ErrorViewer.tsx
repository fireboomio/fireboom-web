import ReactJson from 'react-json-view'

interface ErrorViewerProps {
  error: object
}

const ErrorViewer = ({ error }: ErrorViewerProps) => {
  return <ReactJson src={{ error: 'Memery leak' }} iconStyle="triangle" collapsed={1} />
}

export default ErrorViewer
