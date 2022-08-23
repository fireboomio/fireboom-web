import {
  SearchOutlined,
  BarsOutlined,
  SyncOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  AppstoreOutlined,
  FileImageOutlined,
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
import { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import { FileT } from '@/interfaces/storage'
import requests from '@/lib/fetchers'
import { formatBytes } from '@/lib/utils'

import styles from './Explorer.module.scss'

interface Props {
  bucketId?: number
}

type Option = Partial<FileT> & {
  value: string
  label: React.ReactNode
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
  const [breads, setBreads] = useImmer<string[]>(['/'])
  const [refreshFlag, setRefreshFlag] = useImmer(false)

  const uploadPath = useMemo(() => {
    const rv = target?.isLeaf
      ? target.value.split('/').slice(0, -1).join('/') ?? ''
      : target?.value ?? ''
    return rv
  }, [target])

  useEffect(() => {
    if (!bucketId) return

    void requests
      .get<unknown, FileT[]>('/s3Upload/list', { params: { bucketID: bucketId } })
      .then(res =>
        res
          .map(x => ({
            label: (
              <>
                <span>{x.isDir ? <IconFont type="icon-wenjianjia" /> : <FileImageOutlined />}</span>
                <span className="ml-2">{x.name}</span>
              </>
            ),
            value: x.name,
            isLeaf: !x.isDir,
            ...x,
          }))
          .filter(x => x.name !== '')
      )
      .then(res => setOptions(res))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketId])

  useEffect(() => {
    if (!target) return
    void loadData([{ ...target }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

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
    setBreads((value.at(-1) ?? '').split('/'))
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
    setTarget({ ...targetOption })

    if (targetOption.isLeaf) return

    const files = await requests.get<unknown, FileT[]>('/s3Upload/list', {
      params: { bucketID: bucketId, filePrefix: `${targetOption.value}` },
    })

    const fileOpts = files
      .map(x => ({
        label: (
          <>
            <span>{x.isDir ? <IconFont type="icon-wenjianjia" /> : <FileImageOutlined />}</span>
            <span className="ml-2">{x.name}</span>
          </>
        ),
        value: x.name,
        isLeaf: !x.isDir,
        ...x,
      }))
      .filter(x => x.value !== targetOption.value)

    targetOption.children = fileOpts
    targetOption.loading = false
    setOptions([...options])
  }

  const isImage = (mime: string | undefined) => {
    if (!mime) return undefined
    return mime.indexOf('image/') === 0
  }

  return (
    <>
      <div className="pb-8px flex items-center justify-between border-gray border-b mb-8">
        <Breadcrumb separator=">">
          {breads.map((x, idx) => (
            <Breadcrumb.Item key={idx}>
              <span className="text-red-500/80">{x}</span>
            </Breadcrumb.Item>
          ))}
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
          <Button
            onClick={() => setRefreshFlag(!refreshFlag)}
            icon={<SyncOutlined />}
            className="mr-2"
          >
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
          <Upload
            className={`${styles['upload']}`}
            action="/api/v1/s3Upload/upload"
            data={{ bucketID: bucketId, path: uploadPath }}
            showUploadList={false}
            onChange={() => setRefreshFlag(!refreshFlag)}
          >
            <Button className="mr-2">上传</Button>
          </Upload>
        </div>
      </div>

      <Cascader
        open
        options={options}
        // @ts-ignore
        loadData={x => void loadData(x)}
        // @ts-ignore
        onChange={onChange}
        changeOnSelect
        dropdownClassName={`${styles['casader-select']} flex mb-8`}
      >
        <div />
      </Cascader>

      <Drawer
        title={target?.name}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
        mask={false}
        width={315}
        maskClosable={true}
      >
        <Collapse
          defaultActiveKey={['1', '2']}
          bordered={false}
          expandIconPosition="end"
          ghost={true}
          className={styles['collapse-style']}
        >
          <Panel header="基本信息" key="1">
            <p>类型：{target?.mime ?? '未知'}</p>
            <p>大小：{formatBytes(target?.size)}</p>
            <p>创建于：{target?.createTime ?? ''}</p>
            <p>修改于：{target?.updateTime ?? ''}</p>
          </Panel>
          <Panel header="预览" key="2">
            {isImage(target?.mime) ? (
              <>
                <div
                  className={`${styles['panel-style']} flex-col justify-center items-center flex`}
                >
                  <Image width={200} height={200} src={target?.url ?? ''} alt={target?.value} />
                </div>
              </>
            ) : (
              <Image width={200} height={200} src={'/assets/logo.png'} alt={target?.value} />
            )}
          </Panel>
          <div className="flex flex-col">
            <Button className="m-1.5">下载</Button>
            <Button className="m-1.5">复制URL</Button>
            <Button className="m-1.5">删除</Button>
          </div>
        </Collapse>
      </Drawer>
    </>
  )
}
