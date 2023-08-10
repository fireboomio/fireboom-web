import {
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  SyncOutlined
} from '@ant-design/icons'
import {
  App,
  Button,
  Cascader,
  Collapse,
  Divider,
  Dropdown,
  Empty,
  Image,
  Input,
  Menu,
  message,
  Popconfirm,
  Tooltip,
  Upload
} from 'antd'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import type { FileT } from '@/interfaces/storage'
import requests, { getHeader } from '@/lib/fetchers'
import { formatBytes } from '@/lib/utils'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { downloadOSSFile } from '@/utils/download'

import iconCompress from '../assets/icon-compress.svg'
import iconDoc from '../assets/icon-doc.svg'
import iconFold from '../assets/icon-fold.svg'
import iconOther from '../assets/icon-other.svg'
import iconPic from '../assets/icon-pic.svg'
import iconVideo from '../assets/icon-video.svg'
import styles from './Explorer.module.less'
import FileTypeMap from './fileType'

interface Props {
  bucketName?: number
}

type Option = Partial<ApiDocuments.models_StorageFile> & {
  value: string
  label: React.ReactNode
  children?: Option[]
  loading?: boolean
  isLeaf?: boolean
  parent?: Option | undefined
}

const { Panel } = Collapse

function sortFile(a: FileT, b: FileT) {
  return (a.name.endsWith('/') ? 1 : 2) - (b.name.endsWith('/') ? 1 : 2)
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

export default function StorageExplorer({ bucketName }: Props) {
  const intl = useIntl()
  const navigate = useNavigate()
  const [isSerach, setIsSerach] = useImmer(true)
  const [visible, setVisible] = useImmer(false)
  const [sortField, setSortField] = useImmer('name') // 排序字段
  const [sortAsc, setSortAsc] = useImmer(true) // 是否升序
  const [searchBase, setSearchBase] = useImmer('') // 搜索内容
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [options, setOptions] = useImmer<Option[]>(null!)
  const [target, setTarget] = useImmer<Option | undefined>(undefined)
  const [breads, setBreads] = useImmer<Array<{ value: string; isLeaf: boolean }>>([])
  const [refreshFlag, setRefreshFlag] = useImmer(false)
  const containerEle = useRef<HTMLDivElement>(null)
  const uploadingTip = useRef<Function>()

  const uploadPath = useMemo(() => {
    return target?.isLeaf ? target.parent?.name ?? '' : target?.name ?? ''
  }, [target])

  const inited = useRef(false)
  useEffect(() => {
    // bucketId更新后，清空状态，然后刷新
    setTarget(undefined)
    setVisible(false)
    inited.current = false
    loadMenu(searchBase, {
      forceRoot: true,
      onError: () => {
        if (bucketName) {
          sessionStorage.setItem('storageError', String(bucketName))
          navigate(`/workbench/storage/${bucketName}`)
        }
      }
    }).then(() => {
      inited.current = true
    })
  }, [bucketName, searchBase])
  useEffect(() => {
    if (!inited.current) {
      return
    }
    refresh()
  }, [refreshFlag])
  // 当排序规则变化时，对现有内容进行重排序
  useEffect(() => {
    setOptions(options => {
      const sortQueue: Option[][] = [options]
      while (sortQueue.length) {
        const target = sortQueue.pop()
        if (!target) {
          continue
        }
        sortOptions(target)
        target.forEach(option => {
          if (option?.children?.length) {
            sortQueue.push(option.children)
          }
        })
      }
    })
  }, [sortAsc, sortField])

  /*
   * 刷新列表
   * @param {boolean} refreshChild 是否刷新子节点，默认false时刷新当前节点所在的层级，true时刷新当前节点的子节点
   */
  const refresh = (refreshChild: boolean = false) => {
    const refreshTarget = refreshChild ? target : target?.parent
    loadMenu(refreshTarget?.name ?? searchBase)
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
              <span>
                <FormattedMessage defaultMessage="视图" />
              </span>
            </div>
          )
        },
        {
          key: '1',
          label: (
            <div>
              <BarsOutlined className="mr-2" />
              <span>
                <FormattedMessage defaultMessage="列表" />
              </span>
            </div>
          )
        }
      ]}
    />
  )

  const setSort = (field: string) => {
    if (field === sortField) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const orderMenu = [
    {
      key: '0',
      label: (
        <div onClick={() => setSort('name')}>
          <FormattedMessage defaultMessage="按名称" />
          {sortField === 'name' && (
            <span className="ml-2 text-red-500">
              {sortAsc ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </span>
          )}
        </div>
      )
    },
    {
      key: '1',
      label: (
        <div onClick={() => setSort('size')}>
          <FormattedMessage defaultMessage="按文件大小" />
          {sortField === 'size' && (
            <span className="ml-2 text-red-500">
              {sortAsc ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </span>
          )}
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div onClick={() => setSort('createTime')}>
          <FormattedMessage defaultMessage="按创建时间" />
          {sortField === 'createTime' && (
            <span className="ml-2 text-red-500">
              {sortAsc ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </span>
          )}
        </div>
      )
    },
    {
      key: '3',
      label: (
        <div onClick={() => setSort('updateTime')}>
          <FormattedMessage defaultMessage="按修改时间" />
          {sortField === 'updateTime' && (
            <span className="ml-2 text-red-500">
              {sortAsc ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </span>
          )}
        </div>
      )
    }
  ]

  const onChange = async (value: string[], selectedOptions: Option[]) => {
    setBreads(
      selectedOptions.map(item => ({
        value: item.isLeaf ? item.value : (item.name ?? '').replace(/\/$/, ''),
        isLeaf: !!item.isLeaf
      }))
    )
    let targetOption = selectedOptions[selectedOptions.length - 1]
    if (!targetOption.name?.endsWith('/')) {
      try {
        const resp = await requests.get(`/storageClient/${bucketName}/detail`, {
          params: {
            filename: targetOption.name
          }
        })
        targetOption = { ...targetOption, ...resp }
      } catch (error) {
        //
      }
    }
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
  const sortOptions = (options: any[]) => {
    options.sort((a, b) => {
      let flag
      if (sortField === 'name') {
        flag = a.value.localeCompare(b.value)
      } else if (sortField === 'size') {
        flag = (a?.size ?? 0) - (b?.size ?? 0)
      } else if (sortField === 'createTime') {
        flag = dayjs(a.createTime).valueOf() - dayjs(b.createTime).valueOf()
      } else {
        flag = dayjs(a.updateTime).valueOf() - dayjs(b.updateTime).valueOf()
      }
      return sortAsc ? flag : -flag
    })
  }

  /**
   * 根据path匹配options中的节点并刷新
   */
  const loadMenu = async (path: string, { forceRoot = false, onError = null } = {}) => {
    console.log('loadMenu', path)
    if (!bucketName) return
    const hide = message.loading(intl.formatMessage({ defaultMessage: '加载中' }), 0)
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
      const root: Option = { label: '', name: searchBase, value: '', children: options }
      // 找到需要刷新的节点，如果forceRoot为真则跳过
      let loadTarget = !forceRoot && matchNode(root)
      if (!loadTarget) {
        loadTarget = root
      }
      const loadPath = loadTarget?.name ?? ''

      // 请求并构造节点
      let files = await requests.get<unknown, FileT[]>(`/storageClient/${bucketName}/list`, {
        timeout: 15e3,
        params: { dirname: loadPath ? `${loadPath}` : undefined },
        resolveErrorMsg: response => {
          return intl.formatMessage({ defaultMessage: '文件列表加载失败' })
        }
      })
      // 请求结果为空时，向外抛错误。仅限根目录请求
      if (!files) {
        if (onError && !loadPath) {
          // @ts-ignore
          onError()
        } else {
          files = []
        }
      }
      const oldChildMap = new Map(loadTarget.children?.map(x => [x.name, x]) ?? [])

      // 目录前缀
      const replacePrefix = loadPath.replace(/[^/]*$/, '')
      const fileOpts = files
        .sort(sortFile)
        .filter(x => x.name !== loadPath)
        .map(x => ({
          children: oldChildMap.get(x.name)?.children,
          parent: loadTarget,
          label: (
            <Dropdown
              trigger={['contextMenu']}
              menu={{
                items: [
                  {
                    key: 'rename',
                    label: intl.formatMessage({ defaultMessage: '重命名' }),
                    onClick: e => {
                      e.domEvent.stopPropagation()
                      doRename(x.name).then(newName => {
                        if (newName) {
                          // FIXME 子目录中并不能实时修改页面显示
                          x.name = newName
                        }
                      })
                    }
                  },
                  {
                    key: 'delete',
                    label: (
                      <Popconfirm
                        title={intl.formatMessage({ defaultMessage: '确定删除吗?' })}
                        onConfirm={() => deleteFile(x as Option)}
                        okText={intl.formatMessage({ defaultMessage: '删除' })}
                        cancelText={intl.formatMessage({ defaultMessage: '取消' })}
                      >
                        <div>
                          <FormattedMessage defaultMessage="删除" />
                        </div>
                      </Popconfirm>
                    )
                  }
                ]
              }}
            >
              <div className="flex">
                <span>
                  {x.name.endsWith('/') ? (
                    <img src={iconFold} alt="文件夹" className="h-3.5 w-3.5" />
                  ) : (
                    <img src={FILE_ICON[fileType(x.name)]} alt="图片" className="h-3.5 w-3.5" />
                  )}
                </span>

                <span
                  title={x.name.replace(replacePrefix, '')}
                  className={`ml-2.5 ${styles.ellipsis} ${
                    x.name.endsWith('/') ? 'isDir' : 'isLeaf'
                  }`}
                >
                  {x.name.replace(replacePrefix, '')}
                </span>
              </div>
            </Dropdown>
          ),
          value: x.name.replace(replacePrefix, ''),
          isLeaf: !x.name.endsWith('/'),
          ...x
        }))

      sortOptions(fileOpts)
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

  const { modal } = App.useApp()
  const doRename = async (name: string) => {
    inputValue.current = ''
    const originFileName = name.replace(/\/$/, '').split('/').pop()
    return new Promise<string>(resolve => {
      modal.confirm({
        title: intl.formatMessage({ defaultMessage: '请输入名称' }),
        content: (
          <Input
            autoFocus
            defaultValue={originFileName}
            placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
            onChange={e => {
              inputValue.current = e.target.value
            }}
          />
        ),
        okText: intl.formatMessage({ defaultMessage: '确定' }),
        onOk: () => {
          const newName = inputValue.current?.replace(/ /g, '')
          if (!newName) {
            resolve('')
            return
          }
          const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }))
          requests
            .post(`/storageClient/${bucketName}/rename`, {
              src: name,
              dst: name.replace(/[^/]*(?=$|\/$)/, newName),
              overload: false
            })
            .then(() => {
              hide()
              setVisible(false)
              message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
              setRefreshFlag(!refreshFlag)
              resolve(name.replace(new RegExp(`${originFileName}&`), newName))
            })
        }
      })
    })
  }
  const deleteFile = (file = target) => {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '删除中' }))
    requests.post(`/storageClient/${bucketName}/remove?filename=${file?.name}`).then(() => {
      hide()
      setVisible(false)
      void message.success(intl.formatMessage({ defaultMessage: '删除成功' }))
      setRefreshFlag(!refreshFlag)
    })
  }

  const inputValue = useRef<string>()
  const createFold = () => {
    let dir = uploadPath
    inputValue.current = ''
    modal.confirm({
      title: intl.formatMessage({ defaultMessage: '请输入文件夹名称' }),
      content: (
        <Input
          autoFocus
          placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
          onChange={e => {
            inputValue.current = e.target.value
          }}
        />
      ),
      okText: intl.formatMessage({ defaultMessage: '创建' }),
      onOk: () => {
        if (!inputValue.current) {
          return
        }
        const hide = message.loading(intl.formatMessage({ defaultMessage: '创建中' }))
        requests
          .post(`/storageClient/${bucketName}/createDir`, {
            dirname: `${dir}${inputValue.current}/`
          })
          .then(() => {
            hide()
            setVisible(false)
            message.success(intl.formatMessage({ defaultMessage: '创建成功' }))
            // setRefreshFlag(!refreshFlag)
            // 刷新创建文件夹所在的目录
            loadMenu(uploadPath)
          })
      }
    })
  }

  const renderPreview = (file?: Option) => {
    if (!file) {
      return null
    }
    const type = fileType(file?.name ?? '')
    if (file.name!.endsWith('/')) {
      return <img width={100} height={100} src={iconFold} alt="文件夹" />
    } else if (type === 'pic') {
      return <Image width={100} height={100} src={target?.signedUrl ?? ''} alt={target?.value} />
    } else if (type === 'video') {
      return <video controls width={100} height={100} src={target?.signedUrl ?? ''} />
    } else {
      return (
        <img
          src={FILE_ICON[fileType(target?.value as string)]}
          width={100}
          height={100}
          alt={target?.value}
        />
      )
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header
        className="bg-white flex flex-0 h-13 pr-4  pl-9 items-center justify-between"
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
              <div
                className="cursor-pointer mr-4 inline-flex items-center justify-center"
                onClick={changeSerachState}
              >
                <img alt="" src="/assets/search.svg" />
              </div>
            </Tooltip>
          ) : (
            <Input
              onPressEnter={e => setSearchBase(e.currentTarget.value)}
              autoFocus
              status="error"
              prefix={
                <div className="cursor-pointer text-[0px]" onClick={changeSerachState}>
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
            className="mr-2 !border-0 !p-1"
          >
            <span>
              <FormattedMessage defaultMessage="刷新" />
            </span>
          </Button>
          <Divider type="vertical" />
          {/*<Dropdown overlay={listMenu} placement="bottom">*/}
          {/*  <Button icon={<BarsOutlined />} className="mr-2">*/}
          {/*    列表*/}
          {/*  </Button>*/}
          {/*</Dropdown>*/}
          <Dropdown menu={{ items: orderMenu }} placement="bottom">
            <Button icon={<BarsOutlined />} className="mr-2 !border-0 !p-1">
              {
                {
                  name: intl.formatMessage({ defaultMessage: '按名称' }),
                  size: intl.formatMessage({ defaultMessage: '按文件大小' }),
                  createTime: intl.formatMessage({ defaultMessage: '按创建时间' }),
                  updateTime: intl.formatMessage({ defaultMessage: '按修改时间' })
                }[sortField]
              }
              <span className="ml-1 text-red-500">
                {sortAsc ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              </span>
            </Button>
          </Dropdown>
          <Divider type="vertical" className="!h-3 !mr-5" />
          <Upload
            headers={getHeader()}
            action={`/api/storageClient/${bucketName}/upload`}
            data={{ dirname: uploadPath }}
            showUploadList={false}
            onChange={info => {
              if (info.file.status === 'success' || info.file.status === 'done') {
                uploadingTip.current?.()
                uploadingTip.current = undefined
                loadMenu(uploadPath)
              } else {
                if (!uploadingTip.current) {
                  uploadingTip.current = message.loading(
                    intl.formatMessage({ defaultMessage: '上传中' })
                  )
                }
              }
            }}
          >
            <Button size="small" className="mr-4 !rounded-2px !h-7">
              <FormattedMessage defaultMessage="上传" />
            </Button>
          </Upload>
          <Button size="small" className="!rounded-2px !h-7" onClick={createFold}>
            <FormattedMessage defaultMessage="新建文件夹" />
          </Button>
        </div>
      </header>
      <main className="flex-1 flex min-h-0">
        {containerEle.current && (
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
        )}

        <div
          className={styles.container}
          style={{
            border: '1px solid rgba(95,98,105,0.1)',
            borderBottom: 'none',
            borderRadius: '4px 4px 0 0'
          }}
        >
          <div ref={containerEle} className={styles.cascadeContainer} />
          {options?.length ? null : (
            <div className="w-full h-full flex items-center justify-center">
              <Empty />
            </div>
          )}

          {visible && (
            <aside className={styles.fileDetail}>
              <div className={styles.fileDetailBody}>
                <div className={styles.header}>
                  {target?.isLeaf ? (
                    <img
                      src={FILE_ICON[fileType(target?.name ?? '')]}
                      alt="图片"
                      className="h-3.5 mr-2 w-3.5"
                    />
                  ) : (
                    <img src={iconFold} alt="文件夹" className="h-3.5 mr-2 w-3.5" />
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
                  {!target?.name?.endsWith('/') && (
                    <Panel header={intl.formatMessage({ defaultMessage: '基本信息' })} key="1">
                      <p>
                        <FormattedMessage defaultMessage="类型" />:{' '}
                        {target?.mime ??
                          intl.formatMessage({
                            defaultMessage: '未知',
                            description: '未知的文件类型'
                          })}
                      </p>
                      <p>
                        <FormattedMessage defaultMessage="大小" />: {formatBytes(target?.size)}
                      </p>
                      <p>
                        <FormattedMessage defaultMessage="创建于" />: {target?.lastModified ?? ''}
                      </p>
                      <p>
                        <FormattedMessage defaultMessage="修改于" />: {target?.lastModified ?? ''}
                      </p>
                    </Panel>
                  )}
                  <Panel header={intl.formatMessage({ defaultMessage: '预览' })} key="2">
                    <div
                      className={`${styles['panel-style']} flex-col justify-center items-center flex`}
                    >
                      {renderPreview(target)}
                    </div>
                  </Panel>
                  <div className="flex flex-col">
                    {!target?.name?.endsWith('/') && (
                      // <a className="flex" href={target?.url} download={target?.value}>
                      <Button
                        className="rounded-4px flex-1 m-1.5 !border-[#efeff0]"
                        onClick={() => downloadOSSFile(target!.signedUrl!, target!.value)}
                      >
                        <FormattedMessage defaultMessage="下载" />
                      </Button>
                      // </a>
                    )}
                    {!target?.name?.endsWith('/') && (
                      <Button
                        onClick={() => {
                          // void navigator.clipboard.writeText(`${target?.url ?? ''}`)
                          copy(`${target?.signedUrl ?? ''}`)
                          message.success(intl.formatMessage({ defaultMessage: '复制成功' }))
                        }}
                        className="rounded-4px m-1.5 !border-[#efeff0]"
                      >
                        <FormattedMessage defaultMessage="复制URL" />
                      </Button>
                    )}
                    <Popconfirm
                      title={intl.formatMessage({ defaultMessage: '确定删除吗?' })}
                      onConfirm={() => deleteFile(target)}
                      okText={intl.formatMessage({ defaultMessage: '删除' })}
                      cancelText={intl.formatMessage({ defaultMessage: '取消' })}
                    >
                      <Button className="rounded-4px m-1.5 !border-[#efeff0]">
                        <span className="text-[#F21212]">
                          <FormattedMessage defaultMessage="删除" />
                        </span>
                      </Button>
                    </Popconfirm>
                  </div>
                </Collapse>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}
