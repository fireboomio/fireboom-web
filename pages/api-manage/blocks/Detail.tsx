import { AppleOutlined } from '@ant-design/icons'
import { Badge, Select, Table } from 'antd'
import RcTab from 'pages/components/rc-tab'
import type { FC } from 'react'
import styles from './Detail.module.scss'

type DetailProps = {
  //
}

const tabs = [
  {
    title: '请求参数',
    key: '0',
  },
  {
    title: '注入参数',
    key: '1',
  },
]

const Detail: FC<DetailProps> = () => {
  return (
    <>
      <div className="flex mt-7 items-center">
        <div className={`flex items-center space-x-1 ${styles.label}`}>
          <span className="text-12px  text-[#5F6269] leading-17px">注册接口</span>
          <AppleOutlined />
        </div>
        <div className="flex items-center flex-1">
          <div className="flex items-center space-x-1">
            <span className="text-[#AFB0B4]">#23234456</span>
            <AppleOutlined />
            <AppleOutlined />
          </div>
          <div className="flex items-center space-x-1 ml-7">
            <Badge status="success" color="#1BDD8A" />
            <span className="text-[#000000D9] leading-20px">公开</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>POST</span>
        <span className="flex-1 text-[#000000D9]">/user/reg</span>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>用户角色</span>
        <div className="flex-1 flex items-center">
          <Select className="w-160px"></Select>
          <Select className="flex-1" allowClear></Select>
        </div>
      </div>
      <div className="mt-42px">
        <RcTab tabs={tabs} />
        <Table className="mt-6"></Table>
      </div>
      <div className="mt-42px">
        <div className="text-[#5F6269] leading-22px text-16px">返回响应</div>
        <div className="mt-3">
          <span className={styles.caption}>成功（201）</span>
          <div className={`${styles.content}`}>
            <div className="leading-20px text-[##5F6269]">
              <span>HTTP 状态码：201</span>
              <span className="ml-82px">内容格式：JSON</span>
            </div>
            <Table className="mt-6"></Table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Detail
