import {
  SearchOutlined,
  BarsOutlined,
  SyncOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Dropdown,
  Menu,
  Button,
  Tooltip,
  Upload,
  Divider,
  Cascader,
  Drawer,
  Collapse,
  Input,
} from 'antd'
import Image from 'next/image'
import { useImmer } from 'use-immer'

import type { StorageResp } from '@/interfaces/storage'

import styles from './subs.module.scss'

interface Props {
  content: StorageResp
}

interface Option {
  value: string
  label: string
  children?: Option[]
}

const { Panel } = Collapse

export default function StorageExplorer({ content }: Props) {
  const [isSerach, setIsSerach] = useImmer(true)
  const [visible, setVisible] = useImmer(false)
  const [isArrowUP, setIsArrowUP] = useImmer(false)

  const dropdownMenu = [
    {
      value: '文件一',
      label: '文件一',
      children: [
        {
          value: '文件二',
          label: '文件二',
          children: [
            {
              valu: 'admin1.jpg',
              labe: 'admin1.jpg',
            },
            {
              valu: 'admin2.jpg',
              labe: 'admin2.jpg',
            },
          ],
        },
        {
          value: '文件三',
          label: '文件三',
          children: [
            {
              value: 'admin3.jpg',
              label: 'admin3.jpg',
            },
            {
              value: 'admin4.jpg',
              label: 'admin4.jpg',
            },
          ],
        },
      ],
    },
  ]

  const options = dropdownMenu as Option[]

  if (!content) {
    return <></>
  }

  const changeSerachState = () => {
    setIsSerach(!isSerach)
  }

  const listMenu = (
    <Menu
      items={[
        {
          key: '0',
          label: (
            <div>
              <AppstoreOutlined className="mr-2" />
              <span>视图</span>
            </div>
          ),
        },
        {
          key: '1',
          label: (
            <div>
              <BarsOutlined className="mr-2" />
              <span>列表</span>
            </div>
          ),
        },
      ]}
    />
  )

  const orderMenu = (
    <Menu
      items={[
        {
          key: '0',
          label: (
            <div onClick={() => setIsArrowUP(!isArrowUP)}>
              按名称
              <span className="ml-2 text-red-500">
                {isArrowUP ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              </span>
            </div>
          ),
        },
        {
          key: '1',
          label: <div>按创建时间</div>,
        },
        {
          key: '2',
          label: <div>按修改时间</div>,
        },
      ]}
    />
  )

  return (
    <>
      <div className="pb-8px flex items-center justify-between border-gray border-b mb-8">
        <Breadcrumb>
          <Breadcrumb.Item>
            <span className="text-red-500/80">Img</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span className="text-red-500/80">first</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span className="text-gray-500/80">second level</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex justify-center items-center">
          {isSerach ? (
            <Tooltip title="serach">
              <Button
                className="mr-4"
                shape="circle"
                icon={<SearchOutlined />}
                onClick={changeSerachState}
              />
            </Tooltip>
          ) : (
            <Input
              status="error"
              prefix={
                <SearchOutlined onClick={changeSerachState} className={styles['form-item-icon']} />
              }
              className="mr-4"
            />
          )}
          <Divider type="vertical" className="mr-5 h-5" />
          <Button icon={<SyncOutlined />} className="mr-2">
            刷新
          </Button>
          <Dropdown overlay={listMenu} placement="bottom">
            <Button icon={<BarsOutlined />} className="mr-2">
              列表
            </Button>
          </Dropdown>
          <Dropdown overlay={orderMenu} placement="bottom">
            <Button icon={<BarsOutlined />} className="mr-4">
              排序
            </Button>
          </Dropdown>
          <Divider type="vertical" className="mr-5 h-5" />
          <Upload>
            <Button className="mr-2">上传</Button>
          </Upload>
          <Upload>
            <Button>文件夹</Button>
          </Upload>
        </div>
      </div>
      <div>
        <Cascader
          options={options}
          onChange={() => setVisible(true)}
          open
          dropdownClassName={`${styles['casader-select']} flex mb-8`}

          // expandIcon={<FolderOutlined />}
          // dropdownRender={(dropdownMenu) => (
          //   <div>
          //     <FolderOutlined />
          //     <PictureOutlined />
          //   </div>
          // )}
        >
          <a href="#" />
        </Cascader>
      </div>

      <Drawer
        title="avatar2.jpg"
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
        mask={false}
        width={315}
        maskClosable={false}

        // closable={false}
      >
        <Collapse
          defaultActiveKey={['1', '2']}
          bordered={false}
          expandIconPosition="end"
          ghost={true}
          className={styles['collapse-style']}
        >
          <Panel header="基本信息" key="1">
            <p>类型：image/jpg</p>
            <p>大小：127.6kb</p>
            <p>创建于：2022-05-07 12:23</p>
            <p>修改于：2022-05-07 12:23</p>
          </Panel>
          <Panel header="预览" key="2">
            <div className={`${styles['panel-style']} flex-col justify-center items-center flex`}>
              <Image
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F511%2F101611154647%2F111016154647-10-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659607424&t=dec35f08ae686e97c066c2fed2e9fa7c"
                alt=""
              />
              <Button>下载</Button>
              <Button>复制URL</Button>
              <Button>删除</Button>
            </div>
          </Panel>
        </Collapse>
      </Drawer>
    </>
  )
}
