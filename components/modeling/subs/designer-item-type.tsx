import styles from './model-designer.module.scss'

interface Props {
  data: string
  onClick: () => void
}

export default function ModelDesignerItemType({ data, onClick }: Props) {
  return (
    <div className={`${styles['item-col']} ${styles['item-col-type']}`} onClick={onClick}>
      {data}
    </div>
  )
}
