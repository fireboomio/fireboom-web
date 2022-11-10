import iconER from '../../assets/er.svg'
import styles from './pannel.module.less'

interface Props {
  changeToER: () => void
  addNewModel: () => void
}

const OperationButtons = ({ changeToER, addNewModel }: Props) => (
  <div className={styles.actions}>
    <span className="text-[#333] text-14px font-500 mr-auto">概览</span>
    <div onClick={changeToER} className={styles.erBtn}>
      <img src={iconER} alt="ER" />
    </div>
    <div onClick={addNewModel} className={styles.addEntityBtn}>
      +
    </div>
  </div>
)

export default OperationButtons
