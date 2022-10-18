import {
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons'
import {
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

import iconDoc from './../assets/icon-doc.svg'
import iconFold from './../assets/icon-fold.svg'
import iconPic from './../assets/icon-pic.svg'
import iconVideo from './../assets/icon-video.svg'
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

function sortFile(a: FileT, b: FileT) {
  return (a.isDir ? 1 : 2) - (b.isDir ? 1 : 2)
}

function fileIcon(fileName: string): string {
  const fileType = fileName.split('.')?.pop()?.toLowerCase() || ''
  if (
    ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'ico', 'webp', 'tif', 'pcx', 'tga'].includes(
      fileType
    )
  ) {
    return iconPic
  } else if (['mp4', 'avi', '3gp', 'rmvb', 'wmv', 'mov', 'mkv'].includes(fileType)) {
    return iconVideo
  } else {
    return iconDoc
  }
}

export default function StorageExplorer({ bucketId }: Props) {
  const [isSerach, setIsSerach] = useImmer(true)
  const [visible, setVisible] = useImmer(false)
  const [isArrowUP, setIsArrowUP] = useImmer(false)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [options, setOptions] = useImmer<Option[]>(null!)
  const [target, setTarget] = useImmer<Option | undefined>(undefined)
  const [breads, setBreads] = useImmer<Array<{ value: string; isLeaf: boolean }>>([])
  const [refreshFlag, setRefreshFlag] = useImmer(false)
  const containerEle = useRef<HTMLDivElement>(null)

  const uploadPath = useMemo(() => {
    const rv = target?.isLeaf
      ? target.value.split('/').slice(0, -1).join('/') ?? ''
      : target?.value ?? ''
    return rv
  }, [target])

  const loadRoot = () => {
    if (!bucketId) return

    void requests
      .get<unknown, FileT[]>('/s3Upload/list', { params: { bucketID: bucketId } })
      .then(res =>
        res
          .sort(sortFile)
          .map(x => ({
            label: (
              <>
                <span>
                  {x.isDir ? (
                    <img src={iconFold} alt="文件夹" className="w-3.5 h-3.5" />
                  ) : (
                    <img src={fileIcon(x.name)} alt="图片" className="w-3.5 h-3.5" />
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
  }

  useEffect(loadRoot, [bucketId])

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
    setBreads(
      selectedOptions.map(item => ({
        value: item.isLeaf ? item.value : item.value.replace(/\/$/, ''),
        isLeaf: !!item.isLeaf
      }))
    )
    setVisible(false)
    const targetOption = selectedOptions[selectedOptions.length - 1]
    if (targetOption.isLeaf) {
      setTarget({ ...targetOption })
      setVisible(true)
    }
  }

  const loadData = async (selectedOptions: Option[]) => {
    console.log('**', selectedOptions)
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    setTarget({ ...targetOption })

    let path = targetOption.name ?? ''

    console.log(path, targetOption)
    if (targetOption.isLeaf) {
      path = path.replace(/\/[^/]+$/, '')
    }

    if (!path) {
      loadRoot()
      return
    }

    const files = await requests.get<unknown, FileT[]>('/s3Upload/list', {
      params: { bucketID: bucketId, filePrefix: `${path}` }
    })

    const fileOpts = files
      .sort(sortFile)
      .filter(x => x.name !== targetOption.value)
      .map(x => ({
        label: (
          <>
            <span>
              {x.isDir ? (
                <img src={iconFold} alt="文件夹" className="w-3.5 h-3.5" />
              ) : (
                <img src={fileIcon(x.name)} alt="图片" className="w-3.5 h-3.5" />
              )}
            </span>
            <span className={`ml-2.5 ${x.isDir ? 'isDir' : 'isLeaf'}`}>
              {x.name.replace(targetOption.value, '')}
            </span>
          </>
        ),
        value: x.name.replace(targetOption.value, ''),
        isLeaf: !x.isDir,
        ...x
      }))

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

  const createFold = () => {}

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white pl-9 h-13 pr-4 flex  items-center justify-between flex-0">
        <div className="flex flex-1 min-w-0">
          {breads.map((x, idx) => (
            <div key={x.value} className={x.isLeaf ? styles.leafBread : styles.bread}>
              {x.value}
            </div>
          ))}
        </div>
        <div className="flex flex-0 justify-center items-center">
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
            className="mr-2 !p-1 !border-0"
          >
            刷新
          </Button>
          {/*<Dropdown overlay={listMenu} placement="bottom">*/}
          {/*  <Button icon={<BarsOutlined />} className="mr-2">*/}
          {/*    列表*/}
          {/*  </Button>*/}
          {/*</Dropdown>*/}
          <Dropdown overlay={orderMenu} placement="bottom">
            <Button icon={<BarsOutlined />} className="mr-2 !p-1 !border-0">
              排序
            </Button>
          </Dropdown>
          <Divider type="vertical" className="!h-3 !mr-5" />
          <Upload
            action="/api/v1/s3Upload/upload"
            data={{ bucketID: bucketId, path: uploadPath }}
            showUploadList={false}
            onChange={() => setRefreshFlag(!refreshFlag)}
          >
            <Button size="small" className="!h-7 !rounded-2px mr-4">
              上传
            </Button>
          </Upload>
          <Button size="small" className="!h-7 !rounded-2px" onClick={createFold}>
            文件夹
          </Button>
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
                  <img src={fileIcon(target?.name ?? '')} alt="图片" className="w-3.5 h-3.5 mr-2" />
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

function sort(list) {
  let count = 0
  while (1) {
    count++
    const result = new Array(list.length).fill(null)
    list.forEach(x => {
      result[(Math.random() * list.length) | 0] = x
    })
    let errFlag = false
    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === null) {
        errFlag = true
      }
      if (result[i] > result[i + 1]) {
        errFlag = true
      }
    }
    if (result[result.length - 1] === null) {
      errFlag = true
    }
    if (errFlag) {
      continue
    }
    console.log(`排序完成，执行${count}次`)
    return result
  }
}
