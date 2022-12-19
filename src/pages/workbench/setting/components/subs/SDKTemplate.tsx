import { EditFilled } from '@ant-design/icons'
import { Card, Col, Row, Switch } from 'antd'
import { useRef, useState } from 'react'

interface SDKTemplateProps {}

const SDKTemplate = ({}: SDKTemplateProps) => {
  const list = [1, 2, 3, 4, 5, 6]
  return (
    <Card>
      <div className="flex mb-4 items-center">
        <div className="text-base t-medium">SDK模板</div>
        <div className="text-xs ml-4 text-[#787D8B]">系统将实时覆盖开启的SDK</div>
      </div>
      <Row className="" gutter={[32, 32]}>
        {list.map(item => (
          <Col key={item} xl={8} xxl={6} md={12}>
            <SDKTemplateItem />
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default SDKTemplate

const SDKTemplateItem = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)

  const enableEditing = () => {
    setEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'esc') {
      //
    }
  }

  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg">
      <div className="flex items-center">
        <div className="flex-1">
          <div className="text-base t-medium">ts hooks</div>
          <div className="flex mt-1 items-center">
            <div className="rounded-md bg-[#D8D8D8] h-2.5 shadow w-2.5"></div>
            <div className="text-xs ml-1 text-[#5F6269]">Fireboom</div>
          </div>
        </div>
        <Switch className="flex-shrink-0" checked />
      </div>
      <div className="bg-[rgba(95,98,105,0.1)] h-0.5 mt-2 mb-3"></div>
      <div className="text-xs text-[#787D8B] line-clamp-2">
        钩子的typescript SDK，用于生成nodejs的钩子SDK项目，钩子的typescript
        SDK，用于生成nodejs的钩子SDK项目
      </div>
      <div className="h-8 mt-3 relative">
        <input
          value="generated/fireboom.client.ts"
          readOnly={!editing}
          ref={inputRef}
          className="border rounded h-full outline-none border-[rgba(95,98,105,0.1)] text-sm w-full px-3 text-[#5F6269] focus:border-[rgba(95,98,105,0.8)]"
          onKeyDown={onKeyDown}
        />
        <EditFilled
          className="cursor-pointer top-2 right-3 absolute"
          size={12}
          onClick={enableEditing}
        />
      </div>
    </div>
  )
}
