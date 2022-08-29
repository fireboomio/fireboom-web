import { Divider, Form, Input, Switch } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'

import { DirTreeNode, SettingResp } from '@/interfaces/apimanage'
import requests, { getFetcher } from '@/lib/fetchers'

import IconFont from '../iconfont'

type SettingProps = { node?: DirTreeNode }

const Setting: FC<SettingProps> = ({ node }) => {
  const [setting, setSetting] = useState<SettingResp>()
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [submitFlag, setSubmitFlag] = useState<boolean>()

  const [form] = Form.useForm()

  const settingType = useMemo(() => (node?.id === 0 ? 2 : 1), [node?.id])

  useEffect(() => {
    if (!setting) return
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting])

  useEffect(() => {
    if (!setting) return
    form.submit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitFlag])

  useEffect(() => {
    if (!node) return
    const url = node.id === 0 ? '/operateApi/setting' : `/operateApi/setting/${node.id}`
    getFetcher<SettingResp>(url, { settingType: settingType })
      .then(res => setSetting(res))
      .catch((err: Error) => {
        throw err
      })
  }, [node, refreshFlag, settingType])

  function handleFinish(values: SettingResp) {
    if (!node) return
    const payload = {
      ...values,
      cachingMaxAge: values.cachingMaxAge ? +values.cachingMaxAge : 0,
      cachingStaleWhileRevalidate: values.cachingStaleWhileRevalidate
        ? +values.cachingStaleWhileRevalidate
        : 0,
      liveQueryPollingIntervalSeconds: values.liveQueryPollingIntervalSeconds
        ? +values.liveQueryPollingIntervalSeconds
        : 0,
    }
    setSetting(payload)

    const url = node.id === 0 ? '/operateApi/setting' : `/operateApi/setting/${node.id}`
    void requests
      .put(url, { ...payload, settingType: settingType })
      .then(_ => setRefreshFlag(!refreshFlag))
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={setting}
      autoComplete="off"
      labelAlign="left"
      onFinish={handleFinish}
    >
      <Divider orientation="left" orientationMargin={0}>
        <div className="text-[#AFB0B4] text-14px space-x-1">
          <IconFont type="icon-shouquan" />
          <span>授权</span>
        </div>
      </Divider>

      <Form.Item
        label="需要授权"
        name="authenticationRequired"
        valuePropName="checked"
        rules={[{ required: false, message: '请选择' }]}
      >
        <Switch
          checked={setting?.authenticationRequired}
          onChange={() => {
            setSetting({ ...setting, authenticationRequired: !setting?.authenticationRequired })
            setSubmitFlag(!submitFlag)
          }}
        />
        <span className="ml-26px text-[#00000040] text-12px inline-flex items-center ">
          <IconFont type="icon-zhuyi" />
          <span className="ml-1">开启后，登录后才能访问</span>
        </span>
      </Form.Item>

      {node?.operationType !== 'query' ? (
        <></>
      ) : (
        <>
          <Divider orientation="left" orientationMargin={0} className="mt-42px">
            <div className="text-[#AFB0B4] text-14px space-x-1">
              <IconFont type="icon-huancun" />
              <span>缓存</span>
            </div>
          </Divider>
          <Form.Item
            label="开启缓存"
            name="cachingEnable"
            valuePropName="checked"
            rules={[{ required: false, message: 'Please input your password!' }]}
          >
            <Switch onChange={() => setSubmitFlag(!submitFlag)} />
          </Form.Item>
          <Form.Item
            label="最大时长"
            name="cachingMaxAge"
            rules={[{ required: false, message: 'Please input your password!' }]}
          >
            <Input suffix="秒" onBlur={() => setSubmitFlag(!submitFlag)} />
          </Form.Item>
          <Form.Item
            label="重校验时长"
            name="cachingStaleWhileRevalidate"
            rules={[{ required: false, message: 'Please input your password!' }]}
          >
            <Input suffix="秒" onBlur={() => setSubmitFlag(!submitFlag)} />
          </Form.Item>
          <Divider orientation="left" orientationMargin={0} className="mt-42px">
            <div className="text-[#AFB0B4] text-14px space-x-1">
              <IconFont type="icon-shishi" />
              <span>实时</span>
            </div>
          </Divider>
          <Form.Item
            label="开启实时"
            name="liveQueryEnable"
            valuePropName="checked"
            rules={[{ required: false, message: 'Please input your password!' }]}
          >
            <Switch onChange={() => setSubmitFlag(!submitFlag)} />
          </Form.Item>
          <Form.Item
            label="轮询间隔"
            name="liveQueryPollingIntervalSeconds"
            rules={[{ required: false, message: 'Please input your password!' }]}
          >
            <Input suffix="秒" onBlur={() => setSubmitFlag(!submitFlag)} />
          </Form.Item>
        </>
      )}
    </Form>
  )
}

export default Setting
