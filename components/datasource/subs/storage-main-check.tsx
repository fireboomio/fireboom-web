import {
  SearchOutlined,
  BarsOutlined,
  SyncOutlined,
  // FolderOutlined,
  // PictureOutlined,
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
} from 'antd'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './storage-main.module.scss'

interface Props {
  content: DatasourceItem
}

interface Option {
  value: string
  label: string
  children?: Option[]
}
export default function StorageMainCheck({ content }: Props) {
  const [isSerach, setIsSerach] = useImmer(true)
  const [visible, setVisible] = useImmer(false)
  const onChange = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }
  const {
    info: { dropdownMenu },
  } = content
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
          key: '1',
          label: (
            <div>
              <AppstoreOutlined className="mr-2" />
              <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                视图
              </a>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div>
              <BarsOutlined className="mr-2" />
              <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                列表
              </a>
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
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              按名字
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              按创建时间
            </a>
          ),
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              按修改时间
            </a>
          ),
        },
      ]}
    />
  )
  const { Panel } = Collapse
  return (
    <>
      <div className="pb-17px flex items-center justify-between border-gray border-b mb-8">
        <Breadcrumb>
          <Breadcrumb.Item>Img</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">first</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>second level</Breadcrumb.Item>
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
            <Button className="mr-4" icon={<SearchOutlined />} onClick={changeSerachState}>
              Search
            </Button>
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
        {/* {text} */}
        <Cascader
          options={options}
          onChange={onChange}
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
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        visible={visible}
        mask={false}
      >
        <Collapse defaultActiveKey={['1']} onChange={onChange}>
          <Panel header="基本信息" key="1">
            <p>类型：image/jpg</p>
            <p>大小：127.6kb</p>
            <p>创建于：2022-05-07 12:23</p>
            <p>修改于：2022-05-07 12:23</p>
          </Panel>
          <Panel header="预览" key="2">
            <p>
              <img src="" alt="" />
            </p>
          </Panel>
        </Collapse>
      </Drawer>
    </>
  )
}
