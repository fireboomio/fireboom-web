import { ArrowRightOutlined, CloseOutlined } from '@ant-design/icons'
import { Divider, Image, Timeline } from 'antd'

import styles from './home.module.scss'

interface Props {
  handleToggleDesigner: (rightType: string) => void
}

export function Guide({ handleToggleDesigner }: Props) {
  const handleClose = () => {
    handleToggleDesigner('notice')
  }

  return (
    <>
      <div className="mt-5">
        <div className="flex justify-between mt-3.5 mb-4 pr-5">
          <span className="text-lg flex-grow font-bold">新手指引</span>
          <CloseOutlined onClick={handleClose} className="mt-2" />
        </div>
        <Divider className={styles['second-divider']} />
        <Timeline>
          <Timeline.Item color="#3EF7C7">
            <div className={`${styles['first-guide']} mt-6`}>
              <span className="font-bold">数据源</span>
              <div className="mr-6">
                <Image src="/assets/word.svg" alt="图片不见了" width={15} height={13} />
                <span>文档</span>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item color="#3EF7C7">
            <div className={styles['first-guide']}>
              <span>1.1 连接数据库</span>
              <span className="text-[#E92E5E] mr-6">
                修改
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item color="#3EF7C7">
            <div className={styles['first-guide']}>
              <span>1.2 连接REST API</span>
              <span className="text-[#E92E5E] mr-6">
                修改
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item color="#3EF7C7">
            <div className={styles['first-guide']}>
              <span>1.3 连接GraphQL API</span>
              <span className="text-[#E92E5E] mr-6">
                修改
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span className="font-bold">OSS存储</span>
              <div className="mr-6">
                <Image src="/assets/word.svg" alt="图片不见了" width={15} height={13} />
                <span>文档</span>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span>2.1 设置存储提供商</span>
              <span className="text-[#E92E5E] mr-6">
                前往
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span>2.2 上传一个文件</span>
              <span className="text-[#E92E5E] mr-6">
                前往
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span className="font-bold">身份验证</span>
              <div className="mr-6">
                <Image src="/assets/word.svg" alt="图片不见了" width={15} height={13} />
                <span>文档</span>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span>3.1 设置身份提供商</span>
              <span className="text-[#E92E5E] mr-6">
                修改
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span>3.2 注册账户并登录</span>
              <span className="text-[#E92E5E] mr-6">
                前往
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span className="font-bold">对外API</span>
              <div className="mr-6">
                <Image src="/assets/word.svg" alt="图片不见了" width={15} height={13} />
                <span>文档</span>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span>4.1 可视化编写接口</span>
              <span className="text-[#E92E5E] mr-6">
                前往
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className={styles['first-guide']}>
              <span>4.2 下载接口SDK</span>
              <span className="text-[#E92E5E] mr-6">
                前往
                <ArrowRightOutlined />
              </span>
            </div>
          </Timeline.Item>
        </Timeline>
      </div>
    </>
  )
}
