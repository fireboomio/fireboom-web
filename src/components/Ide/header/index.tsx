import { LoadingOutlined, SaveOutlined } from '@ant-design/icons'
import stackblizSDK from '@stackblitz/sdk'
import { Button, Checkbox, Modal, Select, Switch } from 'antd'
import dayjs from 'dayjs'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'

import requests from '@/lib/fetchers'

import iconCloud from '../assets/cloud.svg'
import iconFullscreen from '../assets/fullscreen.svg'
import iconFullscreen2 from '../assets/fullscreen2.svg'
import iconHelp from '../assets/help.svg'
import type { AutoSavePayload } from './../index'
import { AutoSaveStatus } from './../index'
import ideStyles from './index.module.less'
import { useStackblitz } from '@/hooks/stackblitz'

interface Props {
  // 钩子路径
  hookPath: string
  // API域名
  hostUrl: string
  // 隐藏启停开关
  hideSwitch: boolean
  // 保存状态
  savePayload: AutoSavePayload
  fullScreen: boolean
  // 是否禁用此脚本
  disabled?: boolean
  // 点击全屏按钮
  onFullScreen: () => void
  onToggleHook?: (value: boolean) => Promise<void>
  // 点击手动保存按钮
  onSave?: () => void
}

interface DebugResp {
  dependFiles: Record<string, string>
  dependVersion: Record<string, string>
}

const stackblitzRememberKey = 'stackblitz.remember'

const IdeHeaderContainer: FC<Props> = props => {
  // 保存状态text文案
  const [saveStatusText, setSaveStatusText] = useState('')
  // toggle是否loading
  const [toggleLoading, setToggleLoading] = useState(false)
  // 是否确认下次不再提示
  const [stackblitzRemember, setStackblitzRemember] = useState(false)

  const { loading: debugOpenLoading, openHookServer } = useStackblitz()

  useEffect(() => {
    let _text = ''
    const { type, status } = props.savePayload
    const date = new Date()
    switch (status) {
      case AutoSaveStatus.LOADED:
        _text = '已加载最新版本'
        break
      case AutoSaveStatus.SAVEING:
        // 这里牵扯到保存的主动/被动
        if (type === 'active') {
          _text = '手动保存中...'
        } else {
          _text = '自动保存中...'
        }
        break
      case AutoSaveStatus.SAVED:
        // 拼接保存时间, 时:分:秒
        _text = `已保存 ${dayjs().format('HH:mm:ss')}`
        break
      case AutoSaveStatus.EDIT:
        _text = '已编辑'
        break
      case AutoSaveStatus.DEFAULT:
        _text = '示例代码'
        break
      default:
        break
    }
    setSaveStatusText(_text)
  }, [props.savePayload])

  // toggle switch按钮的change事件
  const onToggleHookChange = async (checked: boolean) => {
    setToggleLoading(true)
    if (props.onToggleHook) {
      await props.onToggleHook(checked)
    }
    setToggleLoading(false)
  }

  // 在线stackbliz调试
  const onlineDebug = useCallback(() => {
    openHookServer(`.wundergraph/new_hook/${props.hookPath}.ts:L6`)
  }, [])

  const localDebug = useCallback(() => {
    const remember = localStorage.getItem(stackblitzRememberKey)
    if (remember) {
      window.open('https://stackblitz.com/local')
    } else {
      Modal.info({
        title: '在线调试使用指南',
        width: 584,
        content: <>
        <img src="https://www.litmus.com/wp-content/uploads/2021/02/motion-tween-example.gif" className='w-120' />
        <div className='mt-2'>
          <Checkbox onChange={e => {
            setStackblitzRemember(e.target.checked)
          }}>下次不再提醒</Checkbox>
        </div>
        </>,
        onOk() {
          if (stackblitzRemember) {
            localStorage.setItem(stackblitzRememberKey, '1')
          }
          window.open('https://stackblitz.com/local')
        }
      })
    }
  }, [])

  // 上一次已保存的时间
  return (
    <div className={`${ideStyles['ide-container-header']} flex justify-start items-center`}>
      {/* 左侧 */}
      <div className="flex ide-container-header-left justify-start items-center">
        <div className="flex items-center">
          <div className="title">编辑脚本</div>
          <img src={iconHelp} alt="帮助" className="ml-1" />
        </div>
        {/* 已保存 */}
        <div className="flex ml-3 items-center" style={{ borderLeft: '1px solid #EBEBEB' }}>
          <span className="ml-3 save">{saveStatusText}</span>
          {props.savePayload.status !== null && <img src={iconCloud} alt="帮助" className="ml-1" />}
        </div>
      </div>
      <div className="flex flex-1 ide-container-header-right justify-between">
        <div className="flex items-center">
          <Button size="small" className="ml-4" onClick={localDebug}>
            调试
          </Button>
          <Button size="small" className="ml-4" loading={debugOpenLoading} onClick={onlineDebug}>
            在线调试
          </Button>
          <Button
            className="ml-4"
            onClick={props.onSave}
            size="small"
            disabled={props.savePayload.status !== AutoSaveStatus.EDIT}
            icon={
              props.savePayload.status === AutoSaveStatus.SAVEING ? (
                <LoadingOutlined />
              ) : (
                <SaveOutlined />
              )
            }
          >
            保存
          </Button>
          {/* 开关 */}
          {props.hideSwitch ? null : (
            <div className="flex ml-10 common-form items-center">
              {toggleLoading && <LoadingOutlined className="mr-5" />}
              <div>
                <Switch
                  checked={props.disabled === false}
                  disabled={toggleLoading || props.savePayload.status === AutoSaveStatus.DEFAULT}
                  onChange={onToggleHookChange}
                  unCheckedChildren="关"
                  checkedChildren="开"
                />
              </div>
            </div>
          )}
        </div>
        {/* 右侧区域 */}
        <div className="flex items-center">
          <div className="name">脚本语言</div>
          <div className="ml-2">
            <Select defaultValue="TypeScript">
              <Select.Option value="TypeScript">TypeScript</Select.Option>
            </Select>
          </div>
          <div className="cursor-pointer ml-3">
            <img src={iconHelp} alt="帮助" />
          </div>
          <div className="cursor-pointer ml-3" onClick={() => props.onFullScreen()}>
            {props.fullScreen ? (
              <img src={iconFullscreen2} alt="全屏" />
            ) : (
              <img src={iconFullscreen} alt="全屏" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeHeaderContainer
