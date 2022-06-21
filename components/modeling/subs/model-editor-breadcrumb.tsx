import { AppleOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
export default function ModelEditorBreadcumb() {
  const handleIconClick = () => {
    console.log('aaa')
  }
  return (
    <>
      <div className="flex justify-start items-center  pb-23px">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>Article</Breadcrumb.Item>
          <Breadcrumb.Item>model</Breadcrumb.Item>
        </Breadcrumb>
        <AppleOutlined className="text-base" onClick={handleIconClick}></AppleOutlined>
        <AppleOutlined className="text-base" onClick={handleIconClick}></AppleOutlined>
        <AppleOutlined className="text-base" onClick={handleIconClick}></AppleOutlined>
        <AppleOutlined className="text-base" onClick={handleIconClick}></AppleOutlined>
      </div>
    </>
  )
}
