'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
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

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { convertToDateOnly } from '@/utils/dateConverter'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useSession } from 'next-auth/react'
import { useFetchData } from '@/apihandeler/useFetchData'
import TableFilters from '@/components/TableFilters'
import { Skeleton } from '@mui/material'
import { formatUSD } from '@/utils/usdFormat'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type ProductWithActionsType = any & {
  actions?: string
}

type ProductCategoryType = {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

type keywordstatusType = {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
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
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const productCategoryObj: ProductCategoryType = {
  Accessories: { icon: 'tabler-headphones', color: 'error' },
  'Home Decor': { icon: 'tabler-smart-home', color: 'info' },
  Electronics: { icon: 'tabler-device-laptop', color: 'primary' },
  Shoes: { icon: 'tabler-shoe', color: 'success' },
  Office: { icon: 'tabler-briefcase', color: 'warning' },
  Games: { icon: 'tabler-device-gamepad-2', color: 'secondary' }
}

// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>()

// Update the column definitions and data mapping logic

const CampaginKeyTable = ({ data: CampaginData, handleClose }: { data?: any; handleClose?: () => void }) => {
  const { companyUsers } = useUserStore()
  const session = useSession()
  const router = useRouter()
  const id = CampaginData?.data?.original.id
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)

  const { data: ProductData, isLoading } = useFetchData(
    ['keywords', session?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage, id],
    `/advertising/campaigns/${id}/keywords`
  )

  console.log(CampaginData)

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(ProductData?.keywords ?? [])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('keyword', {
        header: 'keyword',
        cell: ({ row }) => <Typography>{row.original.keyword}</Typography>
      }),

      columnHelper.accessor('Match Type', {
        header: 'matchType',
        cell: ({ row }) => <Typography>{row.original.matchType}</Typography>
      }),
      columnHelper.accessor('bid', {
        header: 'bid',
        cell: ({ row }) => <Typography>{formatUSD(row.original.bid)}</Typography>
      }),

      columnHelper.accessor('state', {
        header: 'State',
        cell: ({ row }) => (
          <Chip
            label={row.original.state}
            color={row.original.state === 'ENABLED' ? 'success' : 'warning'}
            variant='tonal'
            size='small'
          />
        )
      })
    ],
    [data]
  )

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
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
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    if (ProductData?.keywords) {
      setData(ProductData?.keywords)
    }
  }, [ProductData?.keywords, data])
  return (
    <>
      <div className='flex flex-wrap justify-end gap-4 p-6 w-full'>
        <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'></div>
      </div>
      <div className='overflow-x-auto w-full'>
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

          {isLoading ? (
            <tbody>
              {[...Array(7)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(4)].map((_, colIndex) => (
                    <td key={colIndex}>
                      <Skeleton variant='text' />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : table?.getFilteredRowModel()?.rows?.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  )
}

export default CampaginKeyTable
