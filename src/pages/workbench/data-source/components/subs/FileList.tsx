import { SearchOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Image, Input, message, Popconfirm, Table, Upload } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { RcFile } from 'antd/lib/upload'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import type { UploadDirectory } from '@/interfaces/fs'
import requests, { getAuthKey, getHeader } from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'
import uploadLocal from '@/utils/uploadLocal'

import styles from './FileList.module.less'

interface Props {
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[]
  ) => void | boolean | string | Blob | File | Promise<void | boolean | string | Blob | File>
  setUploadPath: (value: string) => void
  setVisible: (value: boolean) => void
  // basePath: string
  dir: UploadDirectory
}

export default function FileList({
  beforeUpload,
  setUploadPath,
  setVisible,
  // basePath,
  dir
}: Props) {
  const intl = useIntl()
  const [data, setData] = useState<ApiDocuments.vscode_FileStat[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false)
  const [keyword, setKeyword] = useState('')

  const upProps: UploadProps = {
    name: 'content',
    customRequest(opt) {
      const file = opt.file as RcFile
      uploadLocal(`${dir}/${file.name}`, file)
        .then(res => {
          opt.onSuccess?.(res)
        })
        .catch(e => {
          opt.onError?.(e)
        })
    },
    // action: '/api/vscode/writeFile',
    // headers: getHeader(),
    // data: { uri: `/upload-cloud/${dir}` },
    showUploadList: false,
    beforeUpload: beforeUpload,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} ${intl.formatMessage({ defaultMessage: '上传成功' })}`)
        setRefreshFlag(!refreshFlag)
      } else if (info.file.status === 'error') {
        message.error(
          info.file.response?.message ||
            `${info.file.name} ${intl.formatMessage({ defaultMessage: '上传失败' })}`
        )
      }
    }
  }

  const confirm = (
    rcd: ApiDocuments.vscode_FileStat,
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
  ) => {
    e?.stopPropagation()
    requests.delete('/vscode/delete', {
      data: { uri: `upload-cloud/${dir}/${rcd.name}` }
    })
    setRefreshFlag(!refreshFlag)
  }

  const cancel = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
    e?.stopPropagation()
  }

  useEffect(() => {
    void requests
      .get<any, ApiDocuments.vscode_FileStat[]>(
        `/vscode/readDirectory?uri=upload-cloud/${dir}&ignoreNotExist=true`
      )
      .then(res => {
        setData(res)
      })
  }, [refreshFlag, dir])

  const columns: ColumnsType<ApiDocuments.vscode_FileStat> = [
    {
      title: intl.formatMessage({ defaultMessage: '文件名' }),
      dataIndex: 'name',
      key: 'name',
      className: 'cursor-pointer'
    },
    {
      title: intl.formatMessage({ defaultMessage: '大小' }),
      dataIndex: 'size',
      key: 'size',
      width: 100
    },
    {
      title: intl.formatMessage({ defaultMessage: '创建时间' }),
      dataIndex: 'ctime',
      key: 'ctime',
      width: 180,
      render: v => new Date(v / 1000000).toLocaleString()
    },
    {
      title: intl.formatMessage({ defaultMessage: '修改时间' }),
      dataIndex: 'mtime',
      key: 'mtime',
      width: 180,
      render: v => new Date(v / 1000000).toLocaleString()
    },
    // {
    //   title: intl.formatMessage({ defaultMessage: '权限' }),
    //   dataIndex: 'permission',
    //   key: 'permission',
    //   width: 80
    // },
    // { title: '所有者', dataIndex: 'owner', key: 'owner', width: 100 },
    {
      title: intl.formatMessage({ defaultMessage: '操作' }),
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (_, rcd) => (
        <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <Popconfirm
            title={intl.formatMessage({ defaultMessage: '确认删除？' })}
            onConfirm={e => confirm(rcd, e)}
            onCancel={cancel}
            okText={intl.formatMessage({ defaultMessage: '是' })}
            cancelText={intl.formatMessage({ defaultMessage: '否' })}
          >
            <img
              alt="shanchu"
              src="assets/iconfont/shanchu.svg"
              style={{ height: '1em', width: '1em', fontSize: '16px', color: '#f6595b' }}
              className="cursor-pointer"
            />
          </Popconfirm>

          <a
            className="inline-flex"
            href={`/api/vscode/readFile?uri=${`upload-cloud/${dir}/${rcd.name}`}&auth-key=${getAuthKey()}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt="xiazai"
              src="assets/iconfont/xiazai.svg"
              style={{ height: '1em', width: '1em', fontSize: '22px' }}
              className="cursor-pointer"
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
          value={`upload-cloud/${dir}`}
          readOnly
        />
        <Upload {...upProps} className="cursor-pointer m-auto h-6 ml-3 w-20">
          <div className="flex items-center justify-center">
            <Image
              rootClassName="mr-1"
              height={16}
              width={16}
              src="/assets/upload.svg"
              alt="上传"
              preview={false}
            />
            选择文件
          </div>
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
        dataSource={data.filter(x => x.name!.includes(keyword))}
        pagination={false}
        scroll={{ x: 738, y: 455 }}
        rowKey={rcd => rcd.name!}
        onRow={rcd => {
          return {
            onClick: event => {
              setUploadPath(`${dir}/${rcd.name}`)
              setVisible(false)
            }
          }
        }}
      />
    </>
  )
}
