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
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import { FileT } from '@/interfaces/storage'
import requests from '@/lib/fetchers'

import styles from './subs.module.scss'

interface Props {
  bucketId?: number
}

type Option = Partial<FileT> & {
  value: string
  label: string
  children?: Option[]
  loading?: boolean
  isLeaf?: boolean
}

const { Panel } = Collapse

export default function StorageExplorer({ bucketId }: Props) {
  const [isSerach, setIsSerach] = useImmer(true)
  const [visible, setVisible] = useImmer(false)
  const [isArrowUP, setIsArrowUP] = useImmer(false)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [options, setOptions] = useImmer<Option[]>(null!)
  const [target, setTarget] = useImmer<Option | undefined>(undefined)

  useEffect(() => {
    if (!bucketId) return

    void requests
      .get<unknown, FileT[]>('/s3Upload/list', { params: { bucketID: bucketId } })
      .then((res) =>
        res
          .map((x) => ({
            value: x.name,
            label: x.name,
            isLeaf: !x.isDir,
            ...x,
          }))
          .filter((x) => x.name !== '')
      )
      .then((res) => setOptions(res))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketId])

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
          label: <div>按文件大小</div>,
        },
        {
          key: '2',
          label: <div>按创建时间</div>,
        },
        {
          key: '3',
          label: <div>按修改时间</div>,
        },
      ]}
    />
  )

  const onChange = (value: string[], selectedOptions: Option[]) => {
    setVisible(false)
    const targetOption = selectedOptions[selectedOptions.length - 1]
    if (targetOption.isLeaf) {
      setTarget({ ...targetOption })
      setVisible(true)
    }
  }

  const loadData = async (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    if (targetOption.isLeaf) return

    const files = await requests.get<unknown, FileT[]>('/s3Upload/list', {
      params: { bucketID: bucketId, filePrefix: `${targetOption.value}` },
    })

    const fileOpts = files
      .map((x) => ({
        value: x.name,
        label: x.name,
        isLeaf: !x.isDir,
        ...x,
      }))
      .filter((x) => x.value !== targetOption.value)

    targetOption.children = fileOpts
    targetOption.loading = false
    setOptions([...options])
  }

  const isImage = (mime: string | undefined) => {
    return !mime
  }

  const makeUrl = (target: Option | undefined) => {
    if (!target) return ''
    return 'https://source.unsplash.com/random/200x200'
  }

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
        </div>
      </div>

      <Cascader
        open
        options={options}
        // @ts-ignore
        loadData={(x) => void loadData(x)}
        // @ts-ignore
        onChange={onChange}
        changeOnSelect
        dropdownClassName={`${styles['casader-select']} flex mb-8`}
      >
        <div />
      </Cascader>

      <Drawer
        title="avatar2.jpg"
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
        mask={false}
        width={315}
        maskClosable={false}
      >
        <Collapse
          defaultActiveKey={['1', '2']}
          bordered={false}
          expandIconPosition="end"
          ghost={true}
          className={styles['collapse-style']}
        >
          <Panel header="基本信息" key="1">
            <p>类型：{target?.mime ?? ''}</p>
            <p>大小：{target?.size ?? ''}</p>
            <p>创建于：{target?.createTime ?? ''}</p>
            <p>修改于：{target?.updateTime ?? ''}</p>
          </Panel>
          <Panel header="预览" key="2">
            <div className={`${styles['panel-style']} flex-col justify-center items-center flex`}>
              {isImage(target?.mime) ? (
                <Image width={200} height={200} src={makeUrl(target)} alt={target?.label} />
              ) : (
                <></>
              )}

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
