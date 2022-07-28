import { MoreOutlined } from '@ant-design/icons'
import { Dropdown, Input, Menu, Popconfirm } from 'antd'
import type { MenuProps } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { StorageResp } from '@/interfaces/storage'
import { StorageDispatchContext, StorageCurrFileContext, StorageSwitchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from '../storage-pannel.module.scss'

interface Props {
  bucket: StorageResp
}

export default function StoragePannelItem({ bucket }: Props) {
  const dispatch = useContext(StorageDispatchContext)
  const [isEditing, setIsEditing] = useImmer(bucket.name == '')
  const [visible, setVisible] = useImmer(false)
  const { currId } = useContext(StorageCurrFileContext)
  const { handleSwitch } = useContext(StorageSwitchContext)
  const [isHovering, setIsHovering] = useImmer(bucket.id === currId)

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2' || e.key === '3') {
      setVisible(false)
    }
  }

  async function handleItemEdit(value: string) {
    if (value === '') {
      dispatch({ type: 'deleted', data: bucket })
    } else {
      if (bucket.id !== 0) {
        await requests.put('/storageBucket ', { ...bucket, name: value })
        dispatch({ type: 'changed', data: { ...bucket, name: value } })
      } else {
        const req = { ...bucket, name: value }
        Reflect.deleteProperty(req, 'id')
        await requests.post('/storageBucket ', req)
        dispatch({ type: 'added', data: { ...bucket, name: value } })
      }
    }
    setIsEditing(false)
  }

  async function handleItemDelete(item: StorageResp) {
    const result = await requests.delete(`/storageBucket /${item.id}`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result.data.code == 200) {
      dispatch({ type: 'deleted', data: item })
    }
  }

  //实现鼠标移出item判断，当菜单显示的时候，仍处于hovering状态
  function leaveItem(MenuVisible: boolean) {
    if (MenuVisible == false) {
      setIsHovering(false)
      setVisible(false)
    }
  }

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: '0',
          label: (
            <div onClick={() => setIsEditing(!isEditing)}>
              <IconFont type="icon-zhongmingming" />
              <span className="ml-1.5">重命名</span>
            </div>
          ),
        },
        {
          key: '1',
          label: (
            <div onClick={() => handleSwitch(bucket.id, 'viewer')}>
              <IconFont type="icon-chakan" />
              <span className="ml-1.5">查看</span>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={() => handleSwitch(bucket.id, 'editor')}>
              <IconFont type="icon-bianji-da" />
              <span className="ml-1.5">配置</span>
            </div>
          ),
        },
        {
          key: '3',
          label: (
            <Popconfirm
              placement="right"
              title="确认删除该文件吗？"
              onConfirm={() => void handleItemDelete(bucket)}
              okText="删除"
              cancelText="取消"
              onCancel={() => setVisible(false)}
              overlayClassName={styles['delete-label']}
              okType={'danger'}
            >
              <div>
                <IconFont type="icon-shanchu" />
                <span className="ml-1.5">删除</span>
              </div>
            </Popconfirm>
          ),
        },
      ]}
    />
  )

  return (
    <div
      className={`flex justify-start items-center py-2.5 pl-4 cursor-pointer hover:bg-[#F8F8F9]"
      ${bucket.id === currId ? 'bg-[#F8F8F9]' : ''}`}
      style={isHovering ? { background: '#F8F8F9' } : {}}
      key={bucket.name}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onClick={() => handleSwitch(bucket.id, 'explorer')}
    >
      {isEditing ? (
        <Input
          onBlur={(e) => void handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => void handleItemEdit(e.target.value)}
          className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
          defaultValue={bucket.name}
          autoFocus
          placeholder="请输入外部数据源名"
        />
      ) : (
        <div
          onClick={() => {
            // setIsEditing(true)
          }}
          className="text-sm font-normal leading-4"
        >
          {bucket.name}
        </div>
      )}

      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
        visible={visible}
        onVisibleChange={(v) => {
          setVisible(v)
          leaveItem(v)
        }}
      >
        <MoreOutlined
          onClick={(e) => e.stopPropagation()}
          className="m-auto mr-0 pr-2"
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        />
      </Dropdown>
    </div>
  )
}
