import { LoadingOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Select, Switch } from 'antd'
import dayjs from 'dayjs'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import iconCloud from '../assets/cloud.svg'
import iconFullscreen from '../assets/fullscreen.svg'
import iconHelp from '../assets/help.svg'
import type { AutoSavePayload } from './../index'
import { AutoSaveStatus } from './../index'
import ideStyles from './index.module.less'

interface Props {
  // 隐藏启停开关
  hideSwitch: boolean
  // 保存状态
  savePayload: AutoSavePayload
  fullScreen: boolean
  // 是否禁用此脚本
  disabled: boolean
  // 点击全屏按钮
  onFullScreen: () => void
  onToggleHook?: (value: boolean) => Promise<void>
  // 点击手动保存按钮
  onSave?: () => void
}

const IdeHeaderContainer: FC<Props> = props => {
  // 保存状态text文案
  const [saveStatusText, setSaveStatusText] = useState('')
  // toggle是否loading
  const [toggleLoading, setToggleLoading] = useState(false)

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
        _text = `已保存 ${dayjs().format('hh:MM:ss')}`
        break
      case AutoSaveStatus.EDIT:
        _text = '已编辑'
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

  // 上一次已保存的时间
  return (
    <div className={`${ideStyles['ide-container-header']} flex justify-start items-center`}>
      {/* 左侧 */}
      <div className="ide-container-header-left flex justify-start items-center">
        <div className="flex items-center">
          <div className="title">编辑脚本</div>
          <img src={iconHelp} alt="帮助" className="ml-1" />
        </div>
        {/* 已保存 */}
        <div className="flex items-center ml-3" style={{ borderLeft: '1px solid #EBEBEB' }}>
          <span className="save ml-3">{saveStatusText}</span>
          {props.savePayload.status !== null && <img src={iconCloud} alt="帮助" className="ml-1" />}
        </div>
      </div>
      <div className="ide-container-header-right flex justify-between flex-1">
        <div className="flex items-center">
          <Button
            onClick={props.onSave}
            size="small"
            disabled={props.savePayload.status === AutoSaveStatus.SAVEING}
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
            <div className="common-form flex items-center ml-10">
              {toggleLoading && <LoadingOutlined className="mr-5" />}
              <div>
                <Switch
                  checked={!props.disabled}
                  disabled={toggleLoading}
                  onChange={onToggleHookChange}
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
          <div className="ml-3 cursor-pointer">
            <img src={iconHelp} alt="帮助" />
          </div>
          <div className="ml-3 cursor-pointer" onClick={() => props.onFullScreen()}>
            {props.fullScreen ? (
              <img src={iconFullscreen} alt="全屏" />
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
