import { EditFilled } from '@ant-design/icons'
import { Card, Col, message, Row, Switch } from 'antd'
import type { KeyboardEventHandler } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'

import requests from '@/lib/fetchers'

type SDKItem = {
  author: string
  description?: string
  dirName: string
  name: string
  outputPath: string
  switch: boolean
}

const SDKTemplate = () => {
  const { data, mutate } = useSWR<SDKItem[]>('/sdk', requests.get)

  const onUpdate = (index: number, sdk: SDKItem) => {
    mutate([...data!.slice(0, index - 2), sdk, ...data!.slice(index - 1)])
  }

  return (
    <Card>
      <div className="flex mb-4 items-center">
        <div className="text-base t-medium">
          <FormattedMessage defaultMessage="SDK模板" />
        </div>
        <div className="text-xs ml-4 text-[#787D8B]">
          <FormattedMessage defaultMessage="系统将实时覆盖开启的SDK" />
        </div>
      </div>
      <Row className="" gutter={[32, 32]}>
        {data?.map((sdk, index) => (
          <Col key={index} xl={8} xxl={6} md={12}>
            <SDKTemplateItem sdk={sdk} onChange={sdk => onUpdate(index, sdk)} />
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default SDKTemplate

const SDKTemplateItem = ({
  onChange,
  sdk
}: {
  sdk: SDKItem
  onChange: (newSDK: SDKItem) => void
}) => {
  const intl = useIntl()
  const [editing, setEditing] = useState(false)
  const [editingValue, setEditingValue] = useState(sdk.outputPath)

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      const value = e.currentTarget.value
      if (e.key === 'Escape') {
        setEditingValue(sdk.outputPath)
        setEditing(false)
      } else if (e.key === 'Enter') {
        requests.put('/sdk/rePath', { outputPath: value, dirName: sdk.dirName }).then(res => {
          console.log('res', res)
          onChange({
            ...sdk,
            outputPath: value
          })
          message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
        })
      }
    },
    [intl, onChange, sdk]
  )

  const onSwitch = useCallback(
    (checked: boolean) => {
      requests.put('/sdk/switch', { switch: checked, dirName: sdk.dirName }).then(res => {
        console.log('res', res)
        onChange({
          ...sdk,
          switch: checked
        })
      })
    },
    [onChange, sdk]
  )

  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg">
      <div className="flex items-center">
        <div className="flex-1">
          <div className="text-base t-medium">{sdk.name}</div>
          <div className="flex mt-1 items-center">
            <div className="rounded-md bg-[#D8D8D8] h-2.5 shadow w-2.5"></div>
            <div className="text-xs ml-1 text-[#5F6269]">{sdk.author}</div>
          </div>
        </div>
        <Switch className="flex-shrink-0" checked={sdk.switch} onChange={onSwitch} />
      </div>
      <div className="bg-[rgba(95,98,105,0.1)] h-0.5 mt-2 mb-3"></div>
      <div className="text-xs text-[#787D8B] line-clamp-2">{sdk.description || '-'}</div>
      <div className="h-8 mt-3 relative">
        <input
          value={editingValue}
          readOnly={!editing}
          className="border rounded h-full outline-none border-[rgba(95,98,105,0.1)] text-sm w-full px-3 text-[#5F6269] focus:border-[rgba(95,98,105,0.8)]"
          onClick={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          onKeyDown={onKeyDown}
          onInput={e => setEditingValue(e.currentTarget.value)}
        />
        <EditFilled className="cursor-pointer top-2 right-3 absolute" size={8} />
      </div>
    </div>
  )
}
