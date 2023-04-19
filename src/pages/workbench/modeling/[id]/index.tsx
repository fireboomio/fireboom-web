import { Col, Empty, Row } from 'antd'
import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'

import DesignerContainer from '../components/designer'
import ErDiagram from '../components/erdiagram'
import PreviewContainer from '../components/preview'

const Modeling = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const {
    panel: { showType, setShowType, dataSources }
  } = useContext(PrismaSchemaContext)

  const { id: paramId } = useParams()
  useEffect(() => {
    if (paramId && dataSources?.length) {
      if (!dataSources.find((x: { id: number }) => x.id === Number(paramId))) {
        if (dataSources.length) {
          navigate(`/workbench/modeling/${dataSources[0].id}`)
        } else {
          navigate(`/workbench/modeling`)
        }
      }
    }
  }, [dataSources, navigate, paramId])

  if (!dataSources)
    return (
      <Empty
        className="pt-20"
        description={intl.formatMessage({ defaultMessage: '数据加载失败！' })}
      />
    )

  return (
    <>
      <Row className="h-full">
        <Col span={24} className="h-full">
          {showType === 'preview' && <PreviewContainer />}
          {showType === 'editModel' && (
            <DesignerContainer
              key="a"
              editType={'edit'}
              type={'model'}
              setShowType={setShowType}
              showType={showType}
            />
          )}
          {showType === 'editEnum' && (
            <DesignerContainer
              key="a"
              editType={'edit'}
              type={'enum'}
              setShowType={setShowType}
              showType={showType}
            />
          )}
          {showType === 'newModel' && (
            <DesignerContainer
              editType={'add'}
              type={'model'}
              setShowType={setShowType}
              showType={showType}
            />
          )}
          {showType === 'newEnum' && (
            <DesignerContainer
              editType={'add'}
              type={'enum'}
              setShowType={setShowType}
              showType={showType}
            />
          )}
          {showType === 'erDiagram' && <ErDiagram />}
        </Col>
      </Row>
    </>
  )
}

export default Modeling
