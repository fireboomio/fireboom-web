import { intl } from "@/providers/IntlProvider"
import { EditFilled } from "@ant-design/icons"
import { Input, Button } from "antd"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useLocation } from "react-router-dom"
import { useAPIManager } from "../../../store"

const APIRemark = () => {
  const { apiDesc, updateRemark } = useAPIManager()
  const [isEditingRemark, setIsEditingRemark] = useState(false)
  const [editingRemarkContent, setEditingRemarkContent] = useState('')
  const [isSavingRemark, setIsSavingRemark] = useState(false)
  const location = useLocation()

  const startEditRemark = () => {
    setIsEditingRemark(true)
    setEditingRemarkContent(apiDesc?.remark || '')
  }

  const onRemarkKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      saveRemark()
    } else if (e.key === 'Escape') {
      setIsEditingRemark(false)
    }
  }

  const saveRemark = async () => {
    if (apiDesc) {
      setIsSavingRemark(true)
      if (await updateRemark(editingRemarkContent)) {
        setIsEditingRemark(false)
      }
      setIsSavingRemark(false)
    }
  }

  useEffect(() => {
    if (isEditingRemark) {
      setIsEditingRemark(false)
    }
  }, [location.pathname])

  return (
    <div className='pt-2 !pl-10 graphiql-toolbar !items-start'>
      {!isEditingRemark ? (<>
        <span className='inline-block text-gray-400 break-all whitespace-pre-wrap leading-4 max-h-12 hover:max-h-none'>{
            apiDesc?.remark || intl.formatMessage({ defaultMessage: '暂无描述' })
          }</span><EditFilled className='ml-2 text-gray-400 cursor-pointer hover:text-gray-600' onClick={startEditRemark} /></>) : (
        <>
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            value={editingRemarkContent}
            onChange={(e) => setEditingRemarkContent(e.target.value)}
            onKeyDown={onRemarkKeyDown}
          />
          <div className="ml-2">
            <Button size="small" loading={isSavingRemark} className='!text-white' type="primary" onClick={saveRemark}>
              <FormattedMessage defaultMessage="保存" />
            </Button>
            <Button size="small" className='mt-2' onClick={() => setIsEditingRemark(false)}>
              <FormattedMessage defaultMessage="取消" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default APIRemark