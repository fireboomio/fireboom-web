import { message, Modal } from 'antd'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import { usePrompt } from '@/hooks/prompt'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { useHookSupport } from '@/utils/datasource'

import { useValidate } from './validate'

export default function useCustom() {
  const { validateName } = useValidate()
  const { checkSupport } = useHookSupport()
  const intl = useIntl()
  const dict = useDict()
  const enabledServer = useSWRImmutable<ApiDocuments.Sdk>('/sdk/enabledServer', requests)
  const { vscode } = useContext(GlobalContext)
  const navigate = useNavigate()
  const prompt = usePrompt()
  const addScript = async (name: string, dir: string) => {
    if (!vscode.isHookServerSelected) {
      await Modal.confirm({
        title: intl.formatMessage({ defaultMessage: '温馨提示' }),
        content: intl.formatMessage({ defaultMessage: '当前未选择钩子语言，是否前往创建？' }),
        onOk() {
          navigate('/workbench/sdk-template')
        }
      })
    } else {
      // @ts-ignore
      if (await checkSupport(dir.split('/').pop())) {
        const { confirm, value } = await prompt({
          title: intl.formatMessage({ defaultMessage: `请输入 {name} 数据源名称` }, { name }),
          validator: (v: string) => {
            if (dir !== dict.customize) {
              // function和proxy支持多级路径
              return validateName(v.replace(/\//g, ''))
            }
            return validateName(v)
          }
        })
        if (!confirm) {
          return
        }
        if (await vscode.show(`${dir}/${value}${enabledServer.data?.extension}`)) {
          message.info(
            intl.formatMessage({ defaultMessage: '数据源创建成功，请在编辑完成后重启钩子服务' })
          )
        }
      }
    }
  }
  return { addScript }
}
