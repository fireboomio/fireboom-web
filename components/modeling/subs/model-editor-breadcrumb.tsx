import { AppleOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'

export default function ModelEditorBreadcumb() {
  const handleIconClick = () => {
    console.log('aaa')
  }

  return (
    <>
      <div className="flex justify-start items-center my-6">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>Article</Breadcrumb.Item>
          <Breadcrumb.Item>model</Breadcrumb.Item>
        </Breadcrumb>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
      </div>
    </>
  )
}
