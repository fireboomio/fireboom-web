import { LoadingOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Modal, Radio, Select, Switch } from 'antd'
import dayjs from 'dayjs'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { useStackblitz } from '@/hooks/stackblitz'

import iconCloud from '../assets/cloud.svg'
import iconFullscreen from '../assets/fullscreen.svg'
import iconFullscreen2 from '../assets/fullscreen2.svg'
import iconHelp from '../assets/help.svg'
import type { AutoSavePayload, HookInfo } from './../index'
import { AutoSaveStatus } from './../index'
import ideStyles from './index.module.less'

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
  // hook内容信息
  hookInfo?: HookInfo
  tabSize: number
  setTabSize: (size: number) => void
}

interface DebugResp {
  dependFiles: Record<string, string>
  dependVersion: Record<string, string>
}

const stackblitzRememberKey = 'stackblitz.remember'

const IdeHeaderContainer: FC<Props> = props => {
  const intl = useIntl()
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
        _text = intl.formatMessage({ defaultMessage: '已加载最新版本' })
        break
      case AutoSaveStatus.SAVEING:
        // 这里牵扯到保存的主动/被动
        if (type === 'active') {
          _text = intl.formatMessage({ defaultMessage: '手动保存中' })
        } else {
          _text = intl.formatMessage({ defaultMessage: '自动保存中' })
        }
        break
      case AutoSaveStatus.SAVED:
        // 拼接保存时间, 时:分:秒
        _text = intl.formatMessage(
          { defaultMessage: '已保存 {time}', description: '保存时间提示' },
          { time: dayjs().format('HH:mm:ss') }
        )
        break
      case AutoSaveStatus.EDIT:
        _text = intl.formatMessage({ defaultMessage: '已编辑' })
        break
      case AutoSaveStatus.DEFAULT:
        _text = intl.formatMessage({ defaultMessage: '示例代码' })
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
    openHookServer(`${props.hookPath}.ts:L3`)
  }, [])

  const localDebug = useCallback(() => {
    const remember = localStorage.getItem(stackblitzRememberKey)
    if (remember) {
      window.open('https://stackblitz.com/local')
    } else {
      Modal.info({
        closable: true,
        title: intl.formatMessage({ defaultMessage: '在线调试使用指南' }),
        width: 720,
        icon: null,
        content: (
          <>
            <img src="/gifs/stackblitz-local-debug.gif" className="w-164" />
            <div className="mt-2">
              <Checkbox
                onChange={e => {
                  setStackblitzRemember(e.target.checked)
                }}
              >
                {intl.formatMessage({ defaultMessage: '下次不再提醒' })}
              </Checkbox>
            </div>
          </>
        ),
        onOk() {
          if (stackblitzRemember) {
            localStorage.setItem(stackblitzRememberKey, '1')
          }
          window.open('https://stackblitz.com/local')
        },
        okText: intl.formatMessage({ defaultMessage: '知道了' })
      })
    }
  }, [])

  // 上一次已保存的时间
  return (
    <div className={`${ideStyles['ide-container-header']} flex justify-start items-center`}>
      {/* 左侧 */}
      <div className="flex ide-container-header-left justify-start items-center">
        <div className="flex items-center">
          <div className="title">
            <FormattedMessage defaultMessage="编辑脚本" />
          </div>
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
            <FormattedMessage defaultMessage="调试" />
          </Button>
          {/*<Button size="small" className="ml-4" loading={debugOpenLoading} onClick={onlineDebug}>*/}
          {/*  <FormattedMessage defaultMessage="在线调试" />*/}
          {/*</Button>*/}
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
            <FormattedMessage defaultMessage="保存" />
          </Button>
          {/* 开关 */}
          {props.hideSwitch ? null : (
            <div className="flex ml-10 common-form items-center">
              {toggleLoading && <LoadingOutlined className="mr-5" />}
              <div>
                <Switch
                  checked={props.disabled === false}
                  disabled={
                    toggleLoading ||
                    props.savePayload.status === AutoSaveStatus.DEFAULT || // 示例代码状态下不允许启用
                    !props.hookInfo?.script.trim() // 代码内容为空时不允许启用
                  }
                  onChange={onToggleHookChange}
                  unCheckedChildren={intl.formatMessage({ defaultMessage: '关' })}
                  checkedChildren={intl.formatMessage({ defaultMessage: '开' })}
                />
              </div>
            </div>
          )}
        </div>
        {/* 右侧区域 */}
        <div className="flex items-center">
          <div className="name">
            <FormattedMessage defaultMessage="tab宽度" />
          </div>
          <div className="ml-2">
            <Radio.Group
              size="small"
              value={props.tabSize}
              onChange={e => {
                props.setTabSize(e.target.value)
              }}
              options={[
                { label: 2, value: 2 },
                { label: 4, value: 4 }
              ]}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <div className="name ml-2">
            <FormattedMessage defaultMessage="脚本语言" />
          </div>
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
