import { Descriptions } from 'antd'

export default function DatasourceDBMainSetting() {
  return (
    <>
      <div className="flex">
        <Descriptions
          bordered
          layout="vertical"
          size="small"
          className="w-2/5 mr-20"
          labelStyle={{
            width: '30%',
          }}
        >
          <Descriptions.Item label="自定义类型">
            <div className="h-100">编辑器</div>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          bordered
          layout="vertical"
          size="small"
          className="w-3/5"
          labelStyle={{
            width: '30%',
          }}
        >
          <Descriptions.Item label="字段类型映射">
            <div className="h-100">编辑器</div>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
