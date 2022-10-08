import { Upload } from 'antd'
import type { UploadProps } from 'antd/es/upload/interface'

import styles from './Uploader.module.scss'

const FormToolTip = (props: UploadProps) => {
  return (
    <div className={styles.uploader}>
      <Upload
        {...props}
        itemRender={(_, file, _fileList, { remove }) => (
          <div className={styles.file} key={file.uid}>
            <div className={styles.icon} />
            <div className={styles.text}>{file.name}</div>
            <div className={styles.size}>100KB</div>
            <div className={styles.clear} onClick={remove} />
          </div>
        )}
      >
        <div className={styles.container}>
          <div className={styles.uploadBtn}>
            <div className={styles.image} />
            <div className={styles.text}>上传</div>
          </div>
        </div>
      </Upload>
    </div>
  )
}

export default FormToolTip
