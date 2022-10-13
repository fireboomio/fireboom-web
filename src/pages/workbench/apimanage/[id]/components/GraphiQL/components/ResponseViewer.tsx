import ReactJson from 'react-json-view'

interface ResponseViewerProps {
  resp: object
}

const ResponseViewer = ({ resp }: ResponseViewerProps) => {
  return (
    <ReactJson
      src={{ user: '123', arr: [{ name: 'json', value: 'hello' }, { label: 'Hello' }] }}
      iconStyle="triangle"
      collapsed={1}
    />
  )
}

export default ResponseViewer
