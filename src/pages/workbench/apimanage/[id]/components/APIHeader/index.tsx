import { EditFilled } from '@ant-design/icons'
import { Breadcrumb, Input, Switch } from 'antd'
import { useState } from 'react'

import { CopyOutlined, FlashFilled, LinkOutlined, SaveFilled } from '../icons'
import styles from './index.module.less'

const APIHeader = () => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [name, setName] = useState('')

  return (
    <div
      className="bg-white flex flex-shrink-0 h-10 px-3 items-center"
      style={{
        borderBottom: '1px solid rgba(95,98,105,0.1)'
      }}
    >
      <Breadcrumb separator=">">
        <Breadcrumb.Item>github</Breadcrumb.Item>
        <Breadcrumb.Item>workflow</Breadcrumb.Item>
        <Breadcrumb.Item>
          {isEditingName ? (
            <Input
              className={styles.nameInput}
              value={name}
              autoFocus
              onChange={e => setName(e.target.value)}
              onKeyDown={e => {
                console.log(e.code)
                if (e.code === '') {
                  //
                }
              }}
            />
          ) : (
            'useForm'
          )}
        </Breadcrumb.Item>
      </Breadcrumb>
      <EditFilled className="text-xs ml-1" />
      <div className="flex text-[rgba(175,176,180,0.6)] items-center">
        <span className="text-xs ml-1">-已保存</span>
        <div className="ml-11" />
        <div className="text-sm relative">
          POST
          <FlashFilled className="h-1.5 top-0.5 -right-1 text-[#3AE375] w-1.5 absolute" />
        </div>
        <CopyOutlined className="ml-3 text-[#6F6F6F]" />
        <LinkOutlined className="ml-2 text-[#6F6F6F]" />
      </div>
      <button className={styles.save}>
        <SaveFilled className={styles.saveIcon} />
        储存
      </button>
      <Switch
        className={styles.enable}
        checkedChildren="开启"
        unCheckedChildren="关闭"
        defaultChecked
      />
    </div>
  )
}

export default APIHeader
