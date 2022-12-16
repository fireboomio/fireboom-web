import { SearchOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Image, Input, message, Popconfirm, Table, Upload } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { RcFile } from 'antd/lib/upload'
import { useEffect, useState } from 'react'

import IconFont from '@/components/Iconfont'
import requests from '@/lib/fetchers'

import styles from './FileList.module.less'

interface TableType {
  name: string
  size: string
  modifyTime: string
  permission: string
  owner: string
}

interface Props {
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[]
  ) => void | boolean | string | Blob | File | Promise<void | boolean | string | Blob | File>
  setUploadPath: (value: string) => void
  setVisible: (value: boolean) => void
  basePath: string
  upType: number // 1: json yaml yml 2: db
}

export default function FileList({
  beforeUpload,
  setUploadPath,
  setVisible,
  basePath,
  upType
}: Props) {
  const [data, setData] = useState<TableType[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false)
  const [keyword, setKeyword] = useState('')

  const upProps: UploadProps = {
    name: 'file',
    action: '/api/v1/file/uploadFile',
    data: { type: upType },
    showUploadList: false,
    beforeUpload: beforeUpload,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        setRefreshFlag(!refreshFlag)
      } else if (info.file.status === 'error') {
        message.error(info.file.response?.message || `${info.file.name} 上传失败`)
      }
    }
  }

  const confirm = (rcd: TableType, e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    e?.stopPropagation()
    rmFile(rcd.name)
    setRefreshFlag(!refreshFlag)
  }

  const cancel = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    e?.stopPropagation()
  }

  useEffect(() => {
    let filter
    if (upType === 1) {
      filter = ['.json', '.yaml', '.yml']
    } else if (upType === 2) {
      filter = ['.db']
    } else if (upType === 3) {
      filter = ['.graphql']
    }
    void requests
      .get<unknown, { path: string; files: TableType[] }>(`/file/${upType}`, {
        params: { names: filter }
      })
      .then(x => {
        if (upType === 1) {
          setData(x.files.filter(f => f.name.endsWith('.json') || f.name.endsWith('.yaml')))
        } else {
          setData(x.files)
        }
      })
  }, [refreshFlag, upType])

  function rmFile(fname: string) {
    void requests
      .delete('/file/removeFile', { data: { name: fname, type: `${upType}` } })
      .then(x => console.log(x))
  }

  const columns: ColumnsType<TableType> = [
    { title: '文件名', dataIndex: 'name', key: 'name', className: 'cursor-pointer' },
    { title: '大小', dataIndex: 'size', key: 'size', width: 100 },
    { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime', width: 180 },
    { title: '权限', dataIndex: 'permission', key: 'permission', width: 80 },
    // { title: '所有者', dataIndex: 'owner', key: 'owner', width: 100 },
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (_, rcd) => (
        <div className="flex items-center justify-between">
          <Popconfirm
            title="确认删除？"
            onConfirm={e => confirm(rcd, e)}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <IconFont
              onClick={e => e?.stopPropagation()}
              type="icon-shanchu"
              className="cursor-pointer"
              style={{ fontSize: '16px', color: '#f6595b' }}
            />
          </Popconfirm>

          <a href={`/api/v1/file/downloadFile?type=${upType}&fileName=${rcd.name}`}>
            <IconFont
              onClick={e => e.stopPropagation()}
              type="icon-xiazai"
              className="cursor-pointer"
              style={{ fontSize: '22px' }}
            />
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <div className="flex mb-3 justify-between">
        <Input
          style={{ height: 26 }}
          className="h-26px max-w-328px"
          addonBefore={
            <Image height={14} width={14} src="/assets/folder.svg" alt="目录" preview={false} />
          }
          defaultValue={'./'}
        />
        <Upload
          {...upProps}
          className="cursor-pointer flex m-auto h-6 mr-3 w-12 items-center justify-center"
        >
          <Image height={16} width={16} src="/assets/upload.svg" alt="上传" preview={false} />
        </Upload>
        <Input
          value={keyword}
          onChange={v => setKeyword(v.target.value)}
          addonBefore={<SearchOutlined />}
          style={{ width: 228, height: 26 }}
        />
      </div>

      <Table
        className={styles.table}
        columns={columns}
        dataSource={data.filter(x => x.name.includes(keyword))}
        pagination={false}
        scroll={{ x: 738, y: 455 }}
        onRow={rcd => {
          return {
            onClick: event => {
              setUploadPath(`${rcd.name}`)
              setVisible(false)
            },
            onDoubleClick: event => {},
            onContextMenu: event => {},
            onMouseEnter: event => {},
            onMouseLeave: event => {}
          }
        }}
      />
    </>
  )
}
