import { useContext } from 'react'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'

import iconER from '../../assets/er.svg'
import iconSwitch from '../../assets/modeling-switch.svg'
import styles from './pannel.module.less'

interface Props {
  changeToER: () => void
  addNewModel: () => void
}

const OperationButtons = ({ changeToER, addNewModel }: Props) => {
  const { panel } = useContext(PrismaSchemaContext)
  // const ctx = useContext(PrismaSchemaContext)
  const { handleSetInEdit, inEdit } = panel || {}
  return (
    <div className={styles.actions}>
      <span className="text-[#333] text-14px font-500 mr-auto">建模</span>
      <div onClick={() => handleSetInEdit(!inEdit)} className={styles.switchBtn}>
        <img src={iconSwitch} alt="switch" />
      </div>
      <div onClick={changeToER} className={styles.erBtn}>
        <img src={iconER} alt="ER" />
      </div>
      <div onClick={addNewModel} className={styles.addEntityBtn}>
        +
      </div>
    </div>
  )
}

export default OperationButtons
