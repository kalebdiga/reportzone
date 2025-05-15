'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
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
import { convertToDateOnly, formatDayTime } from '@/utils/dateConverter'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useSession } from 'next-auth/react'
import { useFetchData } from '@/apihandeler/useFetchData'
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { type UserData } from '@/typs/user.type'
import UpdateCampaginSchedule from './UpdateCampaginSchedule'
import CreateCampaginSchedule from './CreateCampaginSchedule'
import ChangeStatus from './ChangeStatus'
import Delete from './Delete'
import { Skeleton } from '@mui/material'
import Notice from '@/components/Notice'

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

type productStatusType = {
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

const productStatusObj: productStatusType = {
  Scheduled: { title: 'Scheduled', color: 'warning' },
  Published: { title: 'Publish', color: 'success' },
  Inactive: { title: 'Inactive', color: 'error' }
}

// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>()

// Update the column definitions and data mapping logic

const ValidationTable = ({ data: SceduleList, handleClose }: { data: any; handleClose?: () => void }) => {
  console.log('data', SceduleList)

  function mergeWithVerification(unfiltered: any[], filtered: any[]) {
    const isMatch = (a: any, b: any) =>
      a.campaignId === b.campaignId &&
      a.companyId === b.companyId &&
      a.day === b.day &&
      a.hour === b.hour &&
      a.minute === b.minute

    return unfiltered.map(item => {
      const verified = filtered.some(f => isMatch(f, item))
      return {
        ...item,
        verified: verified ? 'Yes' : 'No'
      }
    })
  }

  const mergedData = useMemo(() => {
    return mergeWithVerification(SceduleList.unfiltered, SceduleList.filtered)
  }, [SceduleList])

  console.log(SceduleList, 'scedule list')

  // Update the column definitions and data mapping logic

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('Date', {
        header: 'schedule',
        cell: ({ row }) => <Typography>{formatDayTime(row.original)}</Typography>
      }),
      columnHelper.accessor('verified', {
        header: 'Verified',
        cell: ({ row }) => (
          <Chip
            label={row.original.verified === 'Yes' ? 'Valid' : 'Duplicated'}
            color={row.original.verified === 'Yes' ? 'success' : 'error'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('name', {
        header: 'Campagin Name',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      })
    ],
    [mergedData]
  )
  const table = useReactTable({
    data: mergedData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },

    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      {/* <Card>
        <CardHeader title='Filters' /> */}
      <div className=' w-[100%]'></div>
      <div className=' w-full flex flex-wrap justify-end gap-4 p-6'>
        <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto w-full justify-end'></div>
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
          {table.getFilteredRowModel().rows?.length === 0 ? (
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
      <div className=' px-[4%]'>
        {SceduleList?.filtered?.length !== 0 ? (
          <Notice content="You're about to submit only the valid schedules. Are you sure you want to proceed?" />
        ) : (
          <Notice
            backgroundColor='#fee2e2'
            color='#7f1d1d'
            content='Oops! Every entry has a conflict. Please adjust your schedules before submitting.'
          />
        )}
      </div>
      {/* </Card> */}
    </>
  )
}

export default ValidationTable
