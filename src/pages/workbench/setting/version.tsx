import { Descriptions, Modal } from 'antd'
import copy from 'copy-to-clipboard'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import { Copy, SmileFace } from '@/components/icons'
import type { VersionConfig } from '@/interfaces/setting'
import requests from '@/lib/fetchers'

import styles from './components/subs/subs.module.less'

export default function SettingMainVersion() {
  const intl = useIntl()
  const [verConfig, setVerConfig] = useImmer({} as VersionConfig)

  useEffect(() => {
    async function getData() {
      const result = await requests.get<unknown, VersionConfig>('/setting/versionConfig')
      setVerConfig(result)
    }
    void getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const copyUpdateLink = () => {
    copy('curl -fsSL https://www.fireboom.io/update.sh | bash')
  }

  return (
    <>
      <div className="bg-white h-full pt-6 pl-8">
        <Descriptions
          column={1}
          size="small"
          className={styles['descriptions-box']}
          labelStyle={{
            width: '15%'
          }}
        >
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '飞布版本' })}>
            <div className="flex items-center">
              {verConfig.versionNum ? (
                <div>{verConfig.versionNum}</div>
              ) : (
                <div className="h-22px w-50px"> </div>
              )}
              <div
                className={styles['check-info']}
                onClick={() => {
                  window.open(
                    'https://ansons-organization.gitbook.io/product-manual/geng-xin-ri-zhi',
                    '_blank'
                  )
                }}
              >
                <FormattedMessage defaultMessage="查看更新日志" />
              </div>
              <div
                className={styles['check-info']}
                onClick={() => {
                  copyUpdateLink()
                  Modal.info({
                    closable: true,
                    icon: null,
                    width: 'fit-content',
                    content: (
                      <div className="px-2 py-3">
                        <div className="bg-[#f5f7f9] rounded-4px p-5">
                          <div className="font-14px leading-20px"># 升级飞布命令行</div>
                          <div className="font-14px leading-20px mt-5px flex items-center">
                            <span className="text-[#a484e8]">curl&nbsp;</span>
                            <span className="text-[#294c7c]">-fsSL&nbsp;</span>
                            <span>https://www.fireboom.io/update.sh&nbsp;|&nbsp;</span>
                            <span className="text-[#a484e8]">bash</span>
                            <Copy className="ml-2 cursor-pointer" onClick={copyUpdateLink} />
                          </div>
                        </div>
                        <div className="mt-14 h-5 flex items-center justify-center font-14px leading-20px text-[#333]">
                          <SmileFace className="mr-2" />
                          <span>升级脚本已复制，进入根目录执行即可。</span>
                        </div>
                      </div>
                    ),
                    footer: null
                  })
                }}
              >
                <FormattedMessage defaultMessage="升级" />
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '飞布控制台版本' })}>
            {import.meta.env.VITE_FB_VERSION}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'prisma版本' })}>
            {verConfig.prismaVersion}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: 'prisma引擎版本' })}>
            {verConfig.prismaEngineVersion}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ defaultMessage: '版权' })}>
            {verConfig.copyright}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
