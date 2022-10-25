import { SearchOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Image, Input, message, Table, Upload } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './FileList.module.less'

interface TableType {
  name: string
  size: string
  modifyTime: string
  permission: string
  owner: string
}

const columns: ColumnsType<TableType> = [
  { title: '文件名', dataIndex: 'name', key: 'name', className: 'cursor-pointer' },
  { title: '大小', dataIndex: 'size', key: 'size', width: 100 },
  { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime', width: 180 },
  { title: '权限', dataIndex: 'permission', key: 'permission', width: 80 },
  // { title: '所有者', dataIndex: 'owner', key: 'owner', width: 100 },
  { title: '', dataIndex: 'icon', key: 'icon', width: 50 }
]

interface Props {
  setUploadPath: (value: string) => void
  setVisible: (value: boolean) => void
  basePath: string
  upType: number
}

export default function FileList({ setUploadPath, setVisible, basePath, upType }: Props) {
  const [data, setData] = useState<TableType[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false)

  const upProps: UploadProps = {
    name: 'file',
    action: '/api/v1/file/uploadFile',
    fileList: [],
    data: { type: upType },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        setRefreshFlag(!refreshFlag)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    }
  }

  useEffect(() => {
    void requests.get<unknown, { path: string; files: TableType[] }>(`/file/${upType}`).then(x => {
      setData(
        x.files.map(f => ({
          ...f,
          icon: (
            <IconFont
              onClick={e => {
                e.stopPropagation()
                rmFile(f.name)
                setRefreshFlag(!refreshFlag)
              }}
              type="icon-shanchu"
              className="cursor-pointer"
              style={{ fontSize: '16px', color: '#f6595b' }}
            />
          )
        }))
      )
    })
  }, [refreshFlag])

  function rmFile(fname: string) {
    void requests
      .delete('/file/removeFile', { data: { name: fname, type: `${upType}` } })
      .then(x => console.log(x))
  }

  return (
    <>
      <div className="flex justify-between mb-3">
        <Input
          // size="small"
          style={{ height: 26 }}
          className="max-w-328px h-26px"
          addonBefore={
            <Image height={14} width={14} src="/assets/folder.svg" alt="目录" preview={false} />
          }
          defaultValue={'./'}
        />
        <Upload
          {...upProps}
          className="w-12 h-6 flex items-center justify-center cursor-pointer m-auto mr-3"
        >
          <Image height={16} width={16} src="/assets/upload.svg" alt="上传" preview={false} />
        </Upload>
        <Input addonBefore={<SearchOutlined />} style={{ width: 228, height: 26 }} />
      </div>

      <Table
        className={styles.table}
        columns={columns}
        dataSource={data}
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
