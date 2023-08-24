import { Tooltip } from 'antd'
import { useContext, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import { registerHotkeyHandler } from '@/services/hotkey'

import iconER from '../../assets/er.svg'
import iconSwitch from '../../assets/modeling-switch.svg'
import styles from './pannel.module.less'

interface Props {
  changeToER: () => void
  addNewModel: () => void
}

const OperationButtons = ({ changeToER, addNewModel }: Props) => {
  const intl = useIntl()
  const { panel } = useContext(PrismaSchemaContext)
  // const ctx = useContext(PrismaSchemaContext)
  const { handleSetInEdit, inEdit } = panel || {}
  const { currentEntity } = useCurrentEntity()
  let title = inEdit
    ? intl.formatMessage({ defaultMessage: '数据建模' })
    : intl.formatMessage({ defaultMessage: '数据预览' })
  // 当前无选中对象时，强制显示数据建模
  if (!currentEntity) {
    title = intl.formatMessage({ defaultMessage: '数据建模' })
  }

  // 快捷键
  useEffect(() => {
    return registerHotkeyHandler('alt+t,^+t', () => {
      handleSetInEdit(!inEdit)
    })
  }, [handleSetInEdit, inEdit])

  return (
    <div className={styles.actions}>
      <span className="font-500 text-[#333] text-14px">{title}</span>
      <div className="ml-1 mr-auto text-[10px] text-red p-1 rounded bg-[#aaa] text-white transform scale-88">
        Beta
      </div>
      <div onClick={() => handleSetInEdit(!inEdit)} className={styles.switchBtn}>
        <Tooltip title={<FormattedMessage defaultMessage="切换数据预览和数据建模" />}>
          <img src={iconSwitch} alt="switch" />
        </Tooltip>
      </div>
      <div onClick={changeToER} className={styles.erBtn}>
        <Tooltip title={<FormattedMessage defaultMessage="ER图" />}>
          <img src={iconER} alt="ER" />
        </Tooltip>
      </div>
      <div onClick={addNewModel} className={styles.addEntityBtn}>
        <Tooltip title={<FormattedMessage defaultMessage="新建模型" />}>+</Tooltip>
      </div>
    </div>
  )
}

export default OperationButtons
