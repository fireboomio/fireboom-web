import { CaretDownOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import { Button, ConfigProvider, Empty, Popover, Table } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import type { SorterResult } from 'antd/lib/table/interface'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import { getTableColumns } from '@/components/PrismaTable/components/DynamicTable/DynamicTableHelper'
import PreviewActionContainer from '@/components/PrismaTable/components/DynamicTable/PreviewActionContainer'
import FilterContainer from '@/components/PrismaTable/components/Filter'
import { buildFilterVariableFrom } from '@/components/PrismaTable/components/Filter/FilterHelper'
import ModelFormContainer from '@/components/PrismaTable/components/ModelForm'
import { DEFAULT_PAGE_SIZE } from '@/components/PrismaTable/constants'
import { getGraphqlMutation, getGraphqlQuery } from '@/components/PrismaTable/libs/GetGraphqlQuery'
import language from '@/components/PrismaTable/libs/language'
import type { FilterState, GraphQLResp } from '@/components/PrismaTable/libs/types'
import { getTableDataFromGraphQLResp } from '@/components/PrismaTable/libs/utils'
import useTableSchema from '@/lib/hooks/useTableSchema'
import styles from '@/pages/workbench/modeling/components/pannel/pannel.module.less'

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
  const [pageState, setPageState] = useImmer<PageState>({ skip: 0, take: DEFAULT_PAGE_SIZE })
  const [orderByState, setOrderByState] = useImmer<OrderByState>({ orderBy: [] })

  useEffect(() => {
    setPageState({ skip: 0, take: DEFAULT_PAGE_SIZE })
    setOrderByState({ orderBy: [] })
  }, [model, namespace, usage])

  const {
    schema: { models, enums }
  } = useTableSchema()

  const { data, loading, refetch } = useQuery<GraphQLResp>(
    getGraphqlQuery(models, model, namespace),
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

  const { tableData, tableDataTotalCount } = getTableDataFromGraphQLResp(model, data, namespace)

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
    <ConfigProvider locale={zhCN}>
      <ButtonGroup className="w-full mb-4 flex gap-4 justify-end">
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
              updateOriginalFilters={updateInitialFilters}
              setFilterVisible={setFilterVisible}
            />
          }
        >
          <Button className={`${styles['add-btn']} cursor-default p-0`}>
            <div className="flex flex-row gap-1 w-full h-full ">
              <span className="self-center">高级筛选</span>
              <div className="bg-[#FF9378] w-4 h-4 rounded-1/2 mr-2 self-center leading-none">
                {initialFilters.length}
              </div>
              <CaretDownOutlined className={`self-center ${styles['dropdown-icon']}`} />
            </div>
          </Button>
        </Popover>
        {usage === 'dataPreview' && (
          <Button className={styles['add-btn']} onClick={() => setCreateModalVisible(true)}>
            添加
          </Button>
        )}
      </ButtonGroup>
      <Table
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
        dataSource={tableData}
        columns={columns}
        size="small"
        //  @ts-ignore
        onChange={(_page, _filter, sorter) => handleOrderByChange(sorter)}
        rowKey={(record: Record<string, any>) => String(record[currentIdField?.name ?? 'id'])}
        pagination={{
          position: ['bottomRight'],
          showQuickJumper: true,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          total: tableDataTotalCount,
          onChange: handlePageChange,
          onShowSizeChange: handleShowSizeChange
        }}
      />
      <ModelFormContainer
        model={currentModel}
        action="create"
        modalVisible={createModalVisible}
        refetch={refetch}
        namespace={namespace}
        setModalVisible={setCreateModalVisible}
      />
    </ConfigProvider>
  )
}

export default DynamicTable
