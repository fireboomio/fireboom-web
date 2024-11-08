import { useConfig } from "@/providers/config"
import { intl } from "@/providers/IntlProvider"
import { EditFilled } from "@ant-design/icons"
import { Input, Button, Switch, Tooltip } from "antd"
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
  const { graphqlTransformEnabled, toggleTransformInGraphql } = useConfig()

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
      {!isEditingRemark ? (<div className="flex items-start pr-4">
        <span className='inline-block text-gray-400 break-all whitespace-pre-wrap leading-4 max-h-12 hover:max-h-none'>{
            apiDesc?.remark || intl.formatMessage({ defaultMessage: '暂无描述' })
          }</span><EditFilled className='ml-2 text-gray-400 cursor-pointer hover:text-gray-600' onClick={startEditRemark} /></div>) : (
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
      <div className="flex-shrink-0 ml-auto flex items-center">
        <Switch
          checked={graphqlTransformEnabled}
          size="small"
          className="mr-1"
          onChange={(checked) => {
            toggleTransformInGraphql(checked)
          }}
        />
        <Tooltip title={intl.formatMessage({ defaultMessage: '只影响控制台结果，不影响API调用' })}>
          <FormattedMessage defaultMessage="在 GraphQL 内转换" />
        </Tooltip>
      </div>
    </div>
  )
}

export default APIRemark