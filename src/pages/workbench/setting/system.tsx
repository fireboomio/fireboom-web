import { Button, Form, message, Radio, Switch } from 'antd'
import dayjs from 'dayjs'
import { FormattedMessage, useIntl } from 'react-intl'

import InputOrFromEnvWithItem from '@/components/InputOrFromEnv'
import UrlInput from '@/components/UrlInput'
import { useConfigContext } from '@/lib/context/ConfigContext'
import styles from '@/pages/workbench/setting/components/subs/subs.module.less'

interface Runtime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function SettingMainVersion() {
  const intl = useIntl()
  const { globalSetting, updateGlobalSetting } = useConfigContext()
  const [form] = Form.useForm()

  async function onFinish(values: any) {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }), 0)
    try {
      await updateGlobalSetting(values)
      message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
    } catch (error) {
      //
    }
    hide()
  }

  const calTime = (initTime: string) => {
    const time = dayjs.duration(dayjs().diff(dayjs(initTime), 'seconds'), 'seconds') as unknown as {
      $d: Runtime
    }
    return intl.formatMessage(
      { defaultMessage: '{days}天 {hours}时 {minutes}分 {seconds}秒' },
      {
        days: time.$d.days,
        hours: time.$d.hours,
        minutes: time.$d.minutes,
        seconds: time.$d.seconds
      }
    )
  }
  return (
    <div className="pt-6">
      <Form
        className="common-form"
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        labelAlign="right"
        initialValues={globalSetting}
      >
        <Form.Item label={intl.formatMessage({ defaultMessage: '运行时长' })}>
          {calTime(dayjs((window as any).getGlobalStartTime()).format('YYYY-MM-DD HH:mm:ss'))}
        </Form.Item>
        <InputOrFromEnvWithItem
          formItemProps={{
            label: intl.formatMessage({ defaultMessage: 'API外网地址' }),
            name: ['nodeOptions', 'publicNodeUrl']
          }}
          // @ts-ignore
          inputRender={props => <UrlInput {...props} />}
        />
        <InputOrFromEnvWithItem
          formItemProps={{
            label: intl.formatMessage({ defaultMessage: 'API内网地址' }),
            name: ['nodeOptions', 'nodeUrl'],
            tooltip: intl.formatMessage({ defaultMessage: '服务内网地址，一般不需要修改' })
          }}
          // @ts-ignore
          inputRender={props => <UrlInput {...props} />}
        />
        <InputOrFromEnvWithItem
          formItemProps={{
            label: intl.formatMessage({ defaultMessage: 'API服务监听Host' }),
            name: ['nodeOptions', 'listen', 'host']
          }}
        />
        <InputOrFromEnvWithItem
          formItemProps={{
            label: intl.formatMessage({ defaultMessage: 'API服务监听端口' }),
            name: ['nodeOptions', 'listen', 'port']
          }}
        />
        <InputOrFromEnvWithItem
          formItemProps={{
            label: intl.formatMessage({ defaultMessage: '日志水平' }),
            name: ['nodeOptions', 'logger', 'level']
          }}
          inputRender={props => (
            // @ts-ignore
            <Radio.Group {...props} className="ml-4 flex items-center">
              <Radio value="DEBUG">Debug</Radio>
              <Radio value="INFO">Info</Radio>
              <Radio value="WARN">Warn</Radio>
              <Radio value="ERROR">Error</Radio>
            </Radio.Group>
          )}
        />
        {/* <Form.Item
          label={intl.formatMessage({ defaultMessage: '调试' })}
          name="debugEnabled"
          valuePropName="checked"
        >
          <Switch className={styles['switch-edit-btn']} size="small" />
        </Form.Item> */}
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '日志上报' })}
          name="usageReport"
          valuePropName="checked"
        >
          <Switch className={styles['switch-edit-btn']} size="small" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5, span: 12 }}>
          <Button className={'btn-cancel mr-4'} onClick={() => form.resetFields()}>
            <FormattedMessage defaultMessage="重置" />
          </Button>
          <Button className={'btn-save'} onClick={form.submit}>
            <FormattedMessage defaultMessage="保存" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
