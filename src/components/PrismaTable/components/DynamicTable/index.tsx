import { CaretDownOutlined, SyncOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Empty, Popover, Table, Tooltip } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import type { SorterResult } from 'antd/lib/table/interface'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import { getTableColumns } from '@/components/PrismaTable/components/DynamicTable/DynamicTableHelper'
import PreviewActionContainer from '@/components/PrismaTable/components/DynamicTable/PreviewActionContainer'
import FilterContainer from '@/components/PrismaTable/components/Filter'
import { buildFilterVariableFrom } from '@/components/PrismaTable/components/Filter/FilterHelper'
import ModelFormContainer from '@/components/PrismaTable/components/ModelForm'
import { DEFAULT_PAGE_SIZE } from '@/components/PrismaTable/constants'
import { getGraphqlMutation, getGraphqlQuery } from '@/components/PrismaTable/libs/GetGraphqlQuery'
import language from '@/components/PrismaTable/libs/language'
import type { FilterState, GraphQLResp, SchemaField } from '@/components/PrismaTable/libs/types'
import { getTableDataFromGraphQLResp } from '@/components/PrismaTable/libs/utils'
import useTableSchema from '@/lib/hooks/useTableSchema'

import styles from './index.module.less'

interface Props {
  model: string
  namespace: string
  usage: 'dataPreview' | 'connection'
  initialFilters: FilterState[]
  updateInitialFilters: (newFilters: FilterState[]) => void
  redirectToEntityWithFilters: (entityName: string, filters: FilterState[]) => void
  handleConnect?: (record: Record<string, any>) => void
  connectedRecord?: Record<string, any>
}

interface PageState {
  skip: number
  take: number
}

interface OrderByState {
  orderBy: Array<Record<string, 'asc' | 'desc'>>
}

// 根据表头自动计算列宽
function getTableColumnsFrom(fields: SchemaField[]) {
  return fields.reduce((count, field) => {
    return count + field.name.length * 16 + 40
  }, 60)
}

const DynamicTable = ({
  model,
  namespace,
  usage,
  initialFilters,
  updateInitialFilters,
  redirectToEntityWithFilters,
  handleConnect,
  connectedRecord
}: Props) => {
  const intl = useIntl()
  const [pageState, setPageState] = useImmer<PageState>({ skip: 0, take: DEFAULT_PAGE_SIZE })
  const [orderByState, setOrderByState] = useImmer<OrderByState>({ orderBy: [] })

  useEffect(() => {
    setPageState({ skip: 0, take: DEFAULT_PAGE_SIZE })
    setOrderByState({ orderBy: [] })
  }, [model, namespace, setOrderByState, setPageState, usage])

  const {
    schema: { models, enums }
  } = useTableSchema()

  const { data, loading, refetch } = useQuery<GraphQLResp>(
    // getGraphqlQuery(models, model, namespace),
    // 去掉namespace前缀
    getGraphqlQuery(models, model),
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        ...buildFilterVariableFrom(initialFilters),
        ...orderByState,
        ...pageState
      }
    }
  )

  const [deleteOne] = useMutation(getGraphqlMutation(models, model, 'delete', namespace))

  const [filterVisible, setFilterVisible] = useImmer<boolean>(false)
  const [createModalVisible, setCreateModalVisible] = useImmer<boolean>(false)

  const currentModel = models.find(m => m.id === model)
  const currentModelFields = currentModel?.fields
  const currentIdField = currentModelFields?.find(f => f.isId)

  const columns =
    currentModelFields &&
    getTableColumns(currentModelFields, currentModel, models, redirectToEntityWithFilters)
  if (!columns) {
    return <Empty />
  }

  // const { tableData, tableDataTotalCount } = getTableDataFromGraphQLResp(model, data, namespace)
  // 去掉namespace
  const { tableData, tableDataTotalCount } = getTableDataFromGraphQLResp(model, data)

  const handlePageChange = (page: number, pageSize: number) => {
    setPageState(pageState => {
      pageState.skip = (page - 1) * pageSize
      pageState.take = pageSize
    })
  }

  const handleShowSizeChange = (current: number, size: number) => {
    setPageState(pageState => {
      pageState.skip = (current - 1) * size
      pageState.take = size
    })
  }

  const handleOrderByChange = (
    sorter: SorterResult<Record<string, any>> | SorterResult<Record<string, any>[]>
  ) => {
    if (!sorter.order) {
      setOrderByState(orderBy => {
        orderBy.orderBy = []
      })
    } else {
      setOrderByState(orderBy => {
        const newOrderBy: Record<string, any> = {}
        // @ts-ignore
        newOrderBy[sorter.field] = sorter.order === 'ascend' ? 'asc' : 'desc'
        orderBy.orderBy = [newOrderBy]
      })
    }
  }

  const dataPreviewAction = {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: (value: Record<string, any>) => (
      <PreviewActionContainer
        record={value}
        refetch={refetch}
        deleteOne={deleteOne}
        currentModel={currentModel}
        namespace={namespace}
      />
    )
  }

  const connectAction: Record<string, any> = {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: (record: Record<string, any>) => {
      const connected =
        currentIdField &&
        connectedRecord &&
        record[currentIdField.name] === connectedRecord[currentIdField.name]
      return (
        <ButtonGroup className="flex w-full gap-2">
          {connected ? (
            <Button
              type="link"
              className="p-0"
              onClick={() => {
                // disconnect
                handleConnect && handleConnect({})
              }}
            >
              {language.disConnect}
            </Button>
          ) : (
            <Button
              type="link"
              className="p-0"
              onClick={() => {
                handleConnect && handleConnect(record)
              }}
            >
              {language.connect}
            </Button>
          )}
        </ButtonGroup>
      )
    }
  }

  columns.push(usage === 'connection' ? connectAction : dataPreviewAction)

  return (
    <>
      <div className="bg-white flex flex-shrink-0 h-54px px-11 justify-start items-center">
        <span className="font-medium text-16px">{currentModel.name}</span>
        <span className="mr-auto ml-3 text-14px text-[#118aD1]">model</span>
        <Tooltip title={intl.formatMessage({ defaultMessage: '刷新' })} placement="bottom">
          <SyncOutlined spin={loading} onClick={() => refetch()} className="mr-4 text-lg" />
        </Tooltip>
        <Popover
          destroyTooltipOnHide
          trigger="click"
          placement="bottomRight"
          showArrow={false}
          open={filterVisible}
          onOpenChange={setFilterVisible}
          content={
            <FilterContainer
              enums={enums}
              models={models}
              currentModelName={model}
              originalFilters={initialFilters}
              updateOriginalFilters={filters => {
                setPageState({ skip: 0, take: pageState.take })
                updateInitialFilters(filters)
              }}
              setFilterVisible={setFilterVisible}
            />
          }
        >
          <div className={styles.filterBtn}>
            <FormattedMessage defaultMessage="高级筛选" />
            <div className={styles.dot}>{initialFilters.length}</div>
            <div className={styles.split} />
            <CaretDownOutlined className={`self-center mx-7px ${styles['dropdown-icon']}`} />
          </div>
        </Popover>
        {usage === 'dataPreview' && (
          <div className={styles.addBtn} onClick={() => setCreateModalVisible(true)}>
            <FormattedMessage defaultMessage="添加" />
          </div>
        )}
      </div>
      <div className={styles.tableWrapper}>
        <Table
          loading={loading}
          scroll={{
            x: getTableColumnsFrom(currentModelFields ?? []) + 'px',
            y: 'calc(100vh - 250px)'
          }}
          bordered={false}
          dataSource={tableData}
          columns={columns}
          size="small"
          //  @ts-ignore
          onChange={(_page, _filter, sorter) => handleOrderByChange(sorter)}
          rowKey={(record: Record<string, any>) => String(record[currentIdField?.name ?? 'id'])}
          pagination={{
            current: pageState.skip / pageState.take + 1,
            position: ['bottomRight'],
            showQuickJumper: true,
            defaultPageSize: DEFAULT_PAGE_SIZE,
            total: tableDataTotalCount,
            onChange: handlePageChange,
            onShowSizeChange: handleShowSizeChange
          }}
        />
      </div>
      <ModelFormContainer
        model={currentModel}
        action="create"
        modalVisible={createModalVisible}
        refetch={refetch}
        namespace={namespace}
        setModalVisible={setCreateModalVisible}
      />
    </>
  )
}

export default DynamicTable
