import { AppleOutlined, ConsoleSqlOutlined } from '@ant-design/icons'

import styles from './pannel.module.less'

interface Props {
  changeToER: () => void
}

const OperationButtons = ({ changeToER }: Props) => (
  <div className={styles.actions}>
    <AppleOutlined />
    <AppleOutlined />
    <AppleOutlined />
    <AppleOutlined />
    <AppleOutlined />
    <ConsoleSqlOutlined onClick={changeToER} />
  </div>
)

export default OperationButtons
