import { Col, Empty, Row } from 'antd'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'

import DesignerContainer from '../components/designer'
import ErDiagram from '../components/erdiagram'
import PreviewContainer from '../components/preview'

const Modeling = () => {
  const intl = useIntl()
  const {
    panel: { showType, setShowType }
  } = useContext(PrismaSchemaContext)

  const { data: _, error } = useSWRImmutable(DATABASE_SOURCE, fetchDBSources, {
    revalidateOnMount: true
  })

  if (error)
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
