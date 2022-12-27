import Designer from '@/pages/workbench/data-source/components/subs/Designer'

export default function NewDatasource() {
  return (
    <div className="h-full p-3 pb-0">
      <div className="bg-white h-full pt-5.5 pl-5.5 overflow-auto">
        {/* <div className="flex mb-24px justify-start  items-center">
            <span className="flex-grow font-bold text-base text-[18px]">外部数据源 / 选择数据源</span>
          </div> */}
        <Designer />
      </div>
    </div>
  )
}
