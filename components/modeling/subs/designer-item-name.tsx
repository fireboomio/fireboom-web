import styles from './model-designer.module.scss'

interface Props {
  data: string
  onClick: () => void
}

export default function ModelDesignerItemName({ data, onClick }: Props) {
  return (
    <div className={`${styles['item-col']} ${styles['item-col-name']}`} onClick={onClick}>
      {data}
    </div>
  )
}
