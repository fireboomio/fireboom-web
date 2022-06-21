import { AppleOutlined } from '@ant-design/icons'
export default function ModelEditorTitle() {
  const handleIconClick = () => {
    console.log('aaa')
  }

  return (
    <>
      <div className="flex justify-start items-center mb-6">
        <span className="text-lg flex-grow">编辑/Article</span>
        <AppleOutlined className="text-base" onClick={handleIconClick}></AppleOutlined>
        <AppleOutlined className="text-base" onClick={handleIconClick}></AppleOutlined>
        <AppleOutlined className="text-base" onClick={handleIconClick}></AppleOutlined>
      </div>
    </>
  )
}
