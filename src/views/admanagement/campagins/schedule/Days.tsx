'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { formatUSD } from '@/utils/usdFormat'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row, value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

import DaysData from './../../../../data/data.json'
import { Card, CardHeader, MenuItem } from '@mui/material'
import Filters from './Filters'
import { convertUtcToNewYork } from '@/utils/dateConverter'
const columnHelper = createColumnHelper<any>()

const Days = ({ data: campaignData }: { data?: any[] }) => {
  console.log(DaysData, 'llllllllllllllllllllllllllll')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(DaysData || [])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<any, any>[]>(() => {
    return [
      columnHelper.accessor('campaign_name', {
        header: 'campaign_name',
        cell: ({ row }) => <Typography>{row.original.campaign_name}</Typography>
      }),
      columnHelper.accessor('ad_group_name', {
        header: 'ad_group_name',
        cell: ({ row }) => <Typography>{row.original.ad_group_name}</Typography>
      }),
      columnHelper.accessor('asin', {
        header: 'asin',
        cell: ({ row }) => <Typography>{row.original.asin}</Typography>
      }),
      columnHelper.accessor('sku', {
        header: 'sku',
        cell: ({ row }) => <Typography>{row.original.sku}</Typography>
      }),
      columnHelper.accessor('Clicks', {
        header: 'Clicks',
        cell: ({ row }) => <Typography>{row.original.clicks}</Typography>
      }),
      columnHelper.accessor('cost', {
        header: 'cost',
        cell: ({ row }) => <Typography>{formatUSD(Number(row.original.cost))}</Typography>
      }),

      columnHelper.accessor('time_window_start', {
        header: 'time_window_start',
        cell: ({ row }) => <Typography>{convertUtcToNewYork(row.original.time_window_start)}</Typography>
      })
    ]
  }, [])

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    initialState: {
      pagination: {
        pageSize: 100
      }
    }
  })

  useEffect(() => {
    if (campaignData) {
      setData(campaignData)
    }
  }, [campaignData])

  return (
    <>
      <Card>
        <CardHeader title='Filters' />
        <div className='flex flex-wrap my-[3%] gap-4 p-6 items-center  w-full'>
          <Filters onSubmitEvent={() => {}} />
        </div>
        <div className='w-full overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default Days
