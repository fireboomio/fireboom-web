import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Select, Switch } from 'antd'
import groupBy from 'lodash/groupBy'
import React from 'react'

import { AuthListType } from '@/interfaces/auth'
import { Connector } from '@/interfaces/connector'
import { Experience as ExperienceType } from '@/interfaces/experience'
import { EMAIL, SMS, SOCIAL } from '@/lib/constant'
import { upsertExperience } from '@/lib/service/experience'

import styles from './ExperienceSetting.module.scss'
import SocialContactTransfer from './SocialContactTransfer'

const { Option } = Select

interface Props {
  data: ExperienceType
  connectorsData: Connector[] | undefined
  handleTopToggleDesigner: (authType: AuthListType) => void
}

export interface GroupedSocialItemType {
  key?: string
  list: Connector[]
  name: string
  platform: string[]
  logo: string
  type: string
  title?: string
}

interface GroupedSocialDataType {
  [index: string]: Connector[]
}

interface LoginFormType {
  mainLoginMethod: string
  email: boolean
  otherMethodAvailable: boolean
  sms: boolean
  social: boolean
  username: boolean
  socialValue: string[] | undefined
}

const ExperienceSetting: React.FC<Props> = ({
  data,
  connectorsData = [],
  handleTopToggleDesigner,
}) => {
  const primaryLogin = data?.signInMethods
    ? // @ts-ignore
      Object.keys(data.signInMethods).find(i => data.signInMethods[i] === 'primary')
    : 'username'
  const isOtherMethodAvailable = Object.values(data).filter(i => i === 'disabled').length !== 3
  const originalUsername = data?.signInMethods?.username
  const originalEmail = data?.signInMethods?.email
  const originalSMS = data?.signInMethods?.sms
  const originalSocial = data?.signInMethods?.social
  const initValues = {
    mainLoginMethod: primaryLogin,
    otherMethodAvailable: isOtherMethodAvailable,
    socialValue: data?.socialSignInConnectorTargets,
    username: originalUsername && originalUsername !== 'disabled',
    email: originalEmail && originalEmail !== 'disabled',
    sms: originalSMS && originalSMS !== 'disabled',
    social: originalSocial && originalSocial !== 'disabled',
  }
  const SMSData = connectorsData.filter(item => item.types === SMS)
  const emailData = connectorsData.filter(item => item.types === EMAIL)
  const socialData: Connector[] = connectorsData.filter(item => item.types === SOCIAL)
  // eslint-disable-next-line
  const groupedSocialData: GroupedSocialDataType = groupBy(socialData, item => item.target)
  const socialTransferData: GroupedSocialItemType[] = Object.keys(groupedSocialData).map(item => {
    const newItem = groupedSocialData[item]
    return {
      type: item,
      name: newItem[0].name,
      platform: newItem.map(n => n.platform),
      logo: newItem[0].logo,
      list: newItem,
    }
  }) as GroupedSocialItemType[]
  const isSMSInUse = SMSData.some(item => item.enabled)
  const isEmailInUse = emailData.some(item => item.enabled)
  const isSocialInUse = socialData.some(item => item.enabled)

  const [form] = Form.useForm()
  const otherMethodAvailable = Form.useWatch('otherMethodAvailable', form) as boolean
  const mainLoginMethod = Form.useWatch('mainLoginMethod', form) as string
  const social = Form.useWatch('social', form) as boolean
  const email = Form.useWatch('email', form) as boolean
  const sms = Form.useWatch('sms', form) as boolean

  const handleFinish = async (value: LoginFormType) => {
    const sms = mainLoginMethod == 'sms' ? 'primary' : value.sms ? 'secondary' : 'disabled'
    const email = mainLoginMethod == 'email' ? 'primary' : value.email ? 'secondary' : 'disabled'
    const social = mainLoginMethod == 'social' ? 'primary' : value.social ? 'secondary' : 'disabled'
    const username =
      mainLoginMethod == 'username' ? 'primary' : value.username ? 'secondary' : 'disabled'
    const args = {
      signInMode: 'SignInAndRegister',
      socialSignInConnectorTargets: value.socialValue,
      signInMethods: {
        sms,
        email,
        social,
        username: username,
      },
    }
    const res = await upsertExperience(args)
    if (res) {
      alert('保存成功')
    }
  }

  const handleTransferChange = (_value: string[]) => {
    return
  }

  const goToConnector = () => {
    handleTopToggleDesigner({ name: '连接器', type: 'connect' })
  }

  const displayUnConfigHint = (name: string) => {
    return (
      <div className={styles.loginItemSubHeading}>
        <ExclamationCircleOutlined />
        <span>你还没有设置{name}连接器，你需完成设置后登录体验才会生效</span>
        <Button onClick={goToConnector}>配置</Button>
      </div>
    )
  }
  const switchHint = (type: string) => {
    switch (type) {
      case 'email':
        return (
          !isEmailInUse && <div className={styles.mainLoginHint}>{displayUnConfigHint('邮箱')}</div>
        )
      case 'sms':
        return (
          !isSMSInUse && <div className={styles.mainLoginHint}>{displayUnConfigHint('SMS')}</div>
        )
      case 'social':
        return (
          !isSocialInUse && (
            <div className={styles.mainLoginHint}>{displayUnConfigHint('社交')}</div>
          )
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.experienceSettingWrapper}>
      <Form form={form} initialValues={initValues} onFinish={void handleFinish}>
        <div className={styles.title}>
          <h1>登录体验设置</h1>
          <h2>自定义登录界面，并实时预览真实效果</h2>
        </div>
        <div className={styles.mainLogin}>
          <div className={styles.mainLoginTitle}>
            <span>{'//'}</span>
            <span>主要登录方式</span>
          </div>
          <Form.Item style={{ width: '100%' }} name="mainLoginMethod">
            <Select style={{ width: '100%' }}>
              <Option value="username">用户名密码登录</Option>
              <Option value="email">邮箱登录</Option>
              <Option value="sms">手机号登录</Option>
              <Option value="social">社交账号登录</Option>
            </Select>
          </Form.Item>
          {switchHint(mainLoginMethod)}
        </div>
        {mainLoginMethod === 'social' && !otherMethodAvailable && (
          <div>
            <Form.Item name="socialValue">
              <SocialContactTransfer
                data={socialTransferData}
                onChange={handleTransferChange}
                selectedData={data?.socialSignInConnectorTargets ?? []}
              />
            </Form.Item>
          </div>
        )}
        <div className={styles.otherLogin}>
          <div className={styles.otherLoginTitle}>
            <span>{'//'}</span>
            <span>启用其他登录方式</span>
          </div>
          <div className={styles.otherLoginExplain}>
            <span>开启后，除了主要登录方式，你的app将会支持更多其他的登录方式</span>
            <Form.Item name="otherMethodAvailable" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
          </div>
        </div>
        {otherMethodAvailable && (
          <>
            <div className={styles.passwordLogin}>
              <Form.Item name="username" valuePropName="checked">
                <Checkbox disabled={mainLoginMethod === 'username'}>
                  <div className={styles.checkboxLabel}>
                    <span>用户名密码登录</span>
                    {mainLoginMethod === 'username' && (
                      <div className={styles.passwordLoginSubHeading}>（主要）</div>
                    )}
                  </div>
                </Checkbox>
              </Form.Item>
            </div>

            <div className={styles.loginItemWrapper}>
              <Form.Item name="email" valuePropName="checked">
                <Checkbox disabled={mainLoginMethod === 'email'}>
                  <div className={styles.checkboxLabel}>
                    <span>邮箱登录</span>
                    {mainLoginMethod === 'email' && (
                      <div className={styles.passwordLoginSubHeading}>（主要）</div>
                    )}
                  </div>
                </Checkbox>
              </Form.Item>
              {email && mainLoginMethod !== 'email' && !isEmailInUse && displayUnConfigHint('邮箱')}
            </div>
            <div className={styles.loginItemWrapper}>
              <Form.Item name="sms" valuePropName="checked">
                <Checkbox disabled={mainLoginMethod === 'sms'}>
                  <div className={styles.checkboxLabel}>
                    <span>手机号登录</span>
                    {mainLoginMethod === 'sms' && (
                      <div className={styles.passwordLoginSubHeading}>（主要）</div>
                    )}
                  </div>
                </Checkbox>
              </Form.Item>
              {sms && mainLoginMethod !== 'sms' && !isSMSInUse && displayUnConfigHint('SMS')}
            </div>
            <div className={styles.loginItemWrapper}>
              <Form.Item name="social" valuePropName="checked">
                <Checkbox disabled={mainLoginMethod === 'social'}>
                  <div className={styles.checkboxLabel}>
                    <span>社交账号登录</span>
                    {mainLoginMethod === 'social' && (
                      <div className={styles.passwordLoginSubHeading}>（主要）</div>
                    )}
                  </div>
                </Checkbox>
              </Form.Item>
              {social &&
                mainLoginMethod !== 'social' &&
                !isSocialInUse &&
                displayUnConfigHint('社交')}
            </div>
            {social && (
              <div>
                <Form.Item name="socialValue">
                  <SocialContactTransfer
                    data={socialTransferData}
                    onChange={handleTransferChange}
                    selectedData={data?.socialSignInConnectorTargets ?? []}
                  />
                </Form.Item>
              </div>
            )}
          </>
        )}
        <div>
          <Form.Item>
            <div className={styles.saveWrapper}>
              <Button className={styles.save} type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default ExperienceSetting
