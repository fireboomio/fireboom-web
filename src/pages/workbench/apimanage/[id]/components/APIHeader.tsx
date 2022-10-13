import { Breadcrumb } from 'antd'

interface APIHeaderProps {
  //
}

const APIHeader = ({ /** */ }: APIHeaderProps) => {

  return (
    <div className="bg-white flex flex-shrink-0 h-10 px-3 items-center">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>github</Breadcrumb.Item>
        <Breadcrumb.Item>workflow</Breadcrumb.Item>
        <Breadcrumb.Item>userform</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default APIHeader