import {
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarsOutlined,
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
  Modal,
  Popconfirm,
  Popover,
  Tooltip,
  Upload
} from 'antd'
import { useEffect, useMemo, useRef } from 'react'
import { useImmer } from 'use-immer'

import type { FileT } from '@/interfaces/storage'
import requests from '@/lib/fetchers'
import { formatBytes } from '@/lib/utils'

import iconCompress from './../assets/icon-compress.svg'
import iconDoc from './../assets/icon-doc.svg'
import iconFold from './../assets/icon-fold.svg'
import iconOther from './../assets/icon-other.svg'
import iconPic from './../assets/icon-pic.svg'
import iconVideo from './../assets/icon-video.svg'
import styles from './Explorer.module.less'
import FileTypeMap from './fileType'

interface Props {
  bucketId?: number
}

type Option = Partial<FileT> & {
  value: string
  label: React.ReactNode
  children?: Option[]
  loading?: boolean
  isLeaf?: boolean
  parent?: Option | undefined
}

const { Panel } = Collapse

function sortFile(a: FileT, b: FileT) {
  return (a.isDir ? 1 : 2) - (b.isDir ? 1 : 2)
}

type FileType = keyof typeof FileTypeMap
function fileType(fileName: string): 'pic' | 'video' | 'doc' | 'compress' | 'other' {
  const fileType = fileName.split('.')?.pop()?.toLowerCase() || ''
  const keys = Object.keys(FileTypeMap) as FileType[]
  return (
    keys.find(key => {
      if (FileTypeMap[key as FileType].has(fileType)) {
        return true
      }
    }) ?? 'other'
  )
}
const FILE_ICON = {
  pic: iconPic,
  video: iconVideo,
  doc: iconDoc,
  compress: iconCompress,
  other: iconOther
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
  const uploadingTip = useRef<Function>()

  const uploadPath = useMemo(() => {
    const rv = target?.isLeaf ? target.parent?.name ?? '' : target?.name ?? ''
    console.log('uploadPath', rv)
    return rv
  }, [target])

  const inited = useRef(false)
  useEffect(() => {
    // bucketId更新后，清空状态，然后刷新
    setTarget(undefined)
    setVisible(false)
    inited.current = false
    loadMenu('').then(() => {
      inited.current = true
    })
  }, [bucketId])
  useEffect(() => {
    if (!inited.current) {
      return
    }
    refresh()
  }, [refreshFlag])

  /*
   * 刷新列表
   * @param {boolean} refreshChild 是否刷新子节点，默认false时刷新当前节点所在的层级，true时刷新当前节点的子节点
   */
  const refresh = (refreshChild: boolean = false) => {
    const refreshTarget = refreshChild ? target : target?.parent
    loadMenu(refreshTarget?.name ?? '')
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

    const targetOption = selectedOptions[selectedOptions.length - 1]
    setTarget({ ...targetOption })
    setVisible(true)
    // setVisible(false)
    // if (targetOption.isLeaf) {
    //   setTarget({ ...targetOption })
    //   setVisible(true)
    // }
  }

  /**
   * 根据path匹配options中的节点
   * @param {string} path
   * @param {Option[]} options
   */
  // const matchOption = (path: string, options: Option[]) => {
  //   const pathArr = path.split('/')
  //   const targetOption = options.find(x => x.value === pathArr[0])
  //   if (pathArr.length === 1) {
  //     return targetOption
  //   }
  //   if (targetOption?.children) {
  //     return matchOption(pathArr.slice(1).join('/'), targetOption.children)
  //   }
  //   return undefined
  // }
  /**
   * 根据path匹配options中的节点并刷新
   */
  const loadMenu = async (path: string) => {
    if (!bucketId) return
    const hide = message.loading('加载中', 0)
    try {
      // 找到需要刷新的节点
      const matchNode = (node: Option): Option | undefined => {
        if (!node.children) {
          return
        }
        const fond = node.children.find(x => {
          return x.name && path.startsWith(x.name)
        })
        if (fond) {
          if (path === fond.name) {
            return fond
          } else if (fond.children) {
            return matchNode(fond)
          }
        }
      }
      // 构造一个虚拟的root节点，用于统一根目录刷新和子目录刷新逻辑
      const root: Option = { label: '', name: '', value: '', children: options }
      let loadTarget = matchNode(root)
      if (!loadTarget) {
        loadTarget = root
      }
      const loadPath = loadTarget?.name ?? ''

      // 请求并构造节点
      const files = await requests.get<unknown, FileT[]>('/s3Upload/list', {
        params: { bucketID: bucketId, filePrefix: loadPath ? `${loadPath}` : undefined },
        resolveErrorMsg: response => {
          return '文件列表加载失败'
        }
      })
      const oldChildMap = new Map(loadTarget.children?.map(x => [x.name, x]) ?? [])

      const fileOpts = files
        .sort(sortFile)
        .filter(x => x.name !== loadPath)
        .map(x => ({
          children: oldChildMap.get(x.name)?.children,
          parent: loadTarget,
          label: (
            <>
              <span>
                {x.isDir ? (
                  <img src={iconFold} alt="文件夹" className="w-3.5 h-3.5" />
                ) : (
                  <img src={FILE_ICON[fileType(x.name)]} alt="图片" className="w-3.5 h-3.5" />
                )}
              </span>
              <Popover
                content={
                  <div className="max-w-[50vw] overflow-clip break-all">
                    {x.name.replace(loadPath, '')}
                  </div>
                }
                placement="topLeft"
              >
                <span className={`ml-2.5 ${x.isDir ? 'isDir' : 'isLeaf'}`}>
                  {x.name.replace(loadPath, '')}
                </span>
              </Popover>
            </>
          ),
          value: x.name.replace(loadPath, ''),
          isLeaf: !x.isDir,
          ...x
        }))

      loadTarget.children = fileOpts
      setOptions([...root.children!])
    } catch (e) {
      console.error(e)
    } finally {
      hide()
    }
  }

  const onLoadData = async (selectedOptions: Option[]) => {
    const path = selectedOptions[selectedOptions.length - 1].name ?? ''
    await loadMenu(path)
  }

  const deleteFile = () => {
    void requests
      .post('/s3Upload/remove', { bucketID: bucketId, fileName: target?.name })
      .then(() => {
        void message.success('删除成功')
        setRefreshFlag(!refreshFlag)
      })
  }

  const inputValue = useRef<string>()
  const createFold = () => {
    Modal.info({
      title: '请输入文件夹名称',
      content: (
        <Input
          autoFocus
          placeholder="请输入"
          onChange={e => {
            inputValue.current = e.target.value
          }}
        />
      ),
      okText: '创建',
      onOk: () => {
        if (!inputValue.current) {
          return
        }
        requests.post('/api/v1/s3Upload/upload', {
          bucketID: bucketId,
          path: `${inputValue.current}/`
        })
      }
    })
    // requests.post('/api/v1/s3Upload/upload', { bucketID: bucketId, path: uploadPath })
  }

  const renderPreview = (file?: Option) => {
    if (!file) {
      return null
    }
    const type = fileType(file?.name ?? '')
    if (file.isDir) {
      return <img width={200} height={200} src={iconFold} alt="文件夹" />
    } else if (type === 'pic') {
      return <img width={200} height={200} src={target?.url ?? ''} alt={target?.value} />
    } else if (type === 'video') {
      return <video controls width={200} height={200} src={target?.url ?? ''} />
    } else {
      return (
        <img
          src={FILE_ICON[fileType(target?.value as string)]}
          width={200}
          height={200}
          alt={target?.value}
        />
      )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="bg-white pl-9 h-13 pr-4 flex  items-center justify-between flex-0"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
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
              <div className="mr-4 cursor-pointer" onClick={changeSerachState}>
                <img alt="" src="/assets/search.svg" />
              </div>
            </Tooltip>
          ) : (
            <Input
              status="error"
              prefix={
                <div className="cursor-pointer" onClick={changeSerachState}>
                  <img alt="" src="/assets/search.svg" />
                </div>
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
            onChange={info => {
              if (info.file.status === 'success' || info.file.status === 'done') {
                uploadingTip.current?.()
                uploadingTip.current = undefined
                loadMenu(uploadPath)
              } else {
                if (!uploadingTip.current) {
                  uploadingTip.current = message.loading('上传中...')
                }
              }
            }}
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
          loadData={x => void onLoadData(x)}
          // @ts-ignore
          onChange={onChange}
          changeOnSelect
          popupClassName={`${styles['casader-select']} flex mb-8`}
        >
          <div />
        </Cascader>
      ) : null}

      <div
        className={styles.container}
        style={{
          border: '1px solid rgba(95,98,105,0.1)',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <div ref={containerEle} className={styles.cascadeContainer} />
        {visible ? (
          <div className={styles.fileDetail}>
            <div className={styles.fileDetailBody}>
              <div className={styles.header}>
                {target?.isLeaf ? (
                  <img
                    src={FILE_ICON[fileType(target?.name ?? '')]}
                    alt="图片"
                    className="w-3.5 h-3.5 mr-2"
                  />
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
                  <div
                    className={`${styles['panel-style']} flex-col justify-center items-center flex`}
                  >
                    {renderPreview(target)}
                  </div>
                </Panel>
                <div className="flex flex-col">
                  <a className="flex" href={target?.url} download={target?.value}>
                    <Button className="m-1.5 flex-1 !border-[#efeff0] rounded-4px">下载</Button>
                  </a>
                  <Button
                    onClick={() => void navigator.clipboard.writeText(`${target?.name ?? ''}`)}
                    className="m-1.5 !border-[#efeff0] rounded-4px"
                  >
                    复制URL
                  </Button>
                  <Popconfirm
                    title="确定删除吗?"
                    onConfirm={deleteFile}
                    okText="删除"
                    cancelText="取消"
                  >
                    <Button className="m-1.5 !border-[#efeff0] rounded-4px">
                      <span className="text-[#F21212]">删除</span>
                    </Button>
                  </Popconfirm>
                </div>
              </Collapse>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
