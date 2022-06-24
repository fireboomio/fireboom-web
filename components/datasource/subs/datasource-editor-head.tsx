import { AppleOutlined } from '@ant-design/icons'

export default function DatasourceEditorTitle() {
  const handleIconClick = () => {
    console.log('aaa')
  }

  return (
    <div className="flex justify-start items-center mb-6 ">
      <span className="text-base flex-grow font-bold">外部数据源/DB</span>
      <AppleOutlined className="text-base" onClick={handleIconClick} />
      <AppleOutlined className="text-base ml-3" onClick={handleIconClick} />
      <AppleOutlined className="text-base ml-3" onClick={handleIconClick} />
    </div>
  )
}
