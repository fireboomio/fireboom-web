import {
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Cascader,
  Collapse,
  Divider,
  Dropdown,
  Input,
  Menu,
  message,
  Tooltip,
  Upload
} from 'antd'
import { useEffect, useMemo, useRef } from 'react'
import { useImmer } from 'use-immer'

import type { FileT } from '@/interfaces/storage'
import requests from '@/lib/fetchers'
import { formatBytes } from '@/lib/utils'

import iconFold from './../assets/icon-fold.svg'
import iconPic from './../assets/icon-pic.svg'
import styles from './Explorer.module.less'

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
  const containerEle = useRef<HTMLDivElement>(null)

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
                <span>
                  {x.isDir ? (
                    <img src={iconFold} alt="文件夹" className="w-3.5 h-3.5" />
                  ) : (
                    <img src={iconPic} alt="图片" className="w-3.5 h-3.5" />
                  )}
                </span>
                <span className={`ml-2.5 ${x.isDir ? 'isDir' : 'isLeaf'}`}>{x.name}</span>
              </>
            ),
            value: x.name,
            isLeaf: !x.isDir,
            ...x
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
          )
        },
        {
          key: '1',
          label: (
            <div>
              <BarsOutlined className="mr-2" />
              <span>列表</span>
            </div>
          )
        }
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
          )
        },
        {
          key: '1',
          label: <div>按文件大小</div>
        },
        {
          key: '2',
          label: <div>按创建时间</div>
        },
        {
          key: '3',
          label: <div>按修改时间</div>
        }
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
      params: { bucketID: bucketId, filePrefix: `${targetOption.value}` }
    })

    const fileOpts = files
      .map(x => ({
        label: (
          <>
            <span>
              {x.isDir ? (
                <img src={iconFold} alt="文件夹" className="w-3.5 h-3.5" />
              ) : (
                <img src={iconPic} alt="图片" className="w-3.5 h-3.5" />
              )}
            </span>
            <span className={`ml-2.5 ${x.isDir ? 'isDir' : 'isLeaf'}`}>{x.name}</span>
          </>
        ),
        value: x.name,
        isLeaf: !x.isDir,
        ...x
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

  const deleteFile = () => {
    void requests
      .post('/s3Upload/remove', { bucketID: bucketId, fileName: target?.name })
      .then(() => void message.success('删除成功'))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white pl-9 h-13 pr-4 flex  items-center justify-between flex-0">
        <Breadcrumb separator=">">
          {breads.map((x, idx) => (
            <Breadcrumb.Item key={idx}>
              <span className={idx === breads.length - 1 ? 'text-default' : 'text-[#E92E5E]'}>
                {x}
              </span>
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
          <Divider type="vertical" className="!h-3 !mr-5" />
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
          <Divider type="vertical" className="h-5 mr-5" />
          <Upload
            // className={`${styles['upload']}`}
            action="/api/v1/s3Upload/upload"
            data={{ bucketID: bucketId, path: uploadPath }}
            showUploadList={false}
            // onChange={() => setRefreshFlag(!refreshFlag)}
          >
            <Button>上传</Button>
          </Upload>
        </div>
      </div>

      {containerEle.current ? (
        <Cascader
          getPopupContainer={() => containerEle.current!}
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
      ) : null}

      <div className={styles.container}>
        <div ref={containerEle} className={styles.cascadeContainer} />
        {visible ? (
          <div className={styles.fileDetail}>
            <div className={styles.fileDetailBody}>
              <div className={styles.header}>
                {target?.isLeaf ? (
                  <img src={iconPic} alt="图片" className="w-3.5 h-3.5 mr-2" />
                ) : (
                  <img src={iconFold} alt="文件夹" className="w-3.5 h-3.5 mr-2" />
                )}
                {target?.name}
              </div>
              <Collapse
                defaultActiveKey={['1', '2']}
                bordered={false}
                expandIconPosition="end"
                ghost={true}
                className={styles.collapse}
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
                        <img width={200} height={200} src={target?.url ?? ''} alt={target?.value} />
                      </div>
                    </>
                  ) : (
                    <img
                      className="m-auto block"
                      width={200}
                      height={200}
                      src={'/assets/logo.png'}
                      alt={target?.value}
                    />
                  )}
                </Panel>
                <div className="flex flex-col">
                  <Button className="m-1.5">下载</Button>
                  <Button
                    onClick={() => void navigator.clipboard.writeText(`${target?.name ?? ''}`)}
                    className="m-1.5"
                  >
                    复制URL
                  </Button>
                  <Button onClick={deleteFile} className="m-1.5">
                    <span className="text-[#F21212]">删除</span>
                  </Button>
                </div>
              </Collapse>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
