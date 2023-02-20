import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import events from '@/lib/event/events'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useDBSource from '@/lib/hooks/useDBSource'
import { registerHotkeyHandler } from '@/services/hotkey'

import iconEdit from '../../assets/edit-mode.svg'
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
  const { name: dbSourceName } = useDBSource()
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
      <span className="mr-auto font-500 text-[#333] text-14px">{title}</span>
      <div onClick={() => handleSetInEdit(!inEdit)} className={styles.switchBtn}>
        <img src={iconSwitch} alt="switch" />
      </div>
      {/* <div onClick={changeToER} className={styles.erBtn}>
        <img src={iconER} alt="ER" />
      </div> */}
      <div onClick={addNewModel} className={styles.addEntityBtn}>
        +
      </div>
      {inEdit && (
        <div
          onClick={() => {
            events.emit({ event: 'openModelingTab', data: { name: dbSourceName, isSource: true } })
          }}
          className={styles.editBtn}
        >
          <img src={iconEdit} alt="" />
        </div>
      )}
    </div>
  )
}

export default OperationButtons
