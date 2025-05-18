'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports

import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

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
import CustomTextField from '@core/components/mui/TextField'

// Util Imports

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { convertToDateOnly, formatDayTime } from '@/utils/dateConverter'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useSession } from 'next-auth/react'
import { useFetchData } from '@/apihandeler/useFetchData'
import ChangeStatus from './ChangeStatus'
import Delete from './Delete'
import { Skeleton } from '@mui/material'
import { formatUSD } from '@/utils/usdFormat'
import CreateSceduleModal from '../modals/CreateScedulesModal'
import UpdateCampaginScheduleModal from './modal/UpdateCampaginScheduleModal'

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

// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>()

// Update the column definitions and data mapping logic

const ScedulesTable = ({ Campagindata, handleClose }: { Campagindata?: any; handleClose?: () => void }) => {
  const id = Campagindata?.id

  //(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(100)

  const { companyUsers } = useUserStore()
  const session = useSession()
  const { data: SceduleData, isLoading } = useFetchData(
    ['updateScedule', session?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/schedules?campaignId=${id}`
  )

  // //('data', productData)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(SceduleData || [])
  const [globalFilter, setGlobalFilter] = useState('')

  // Update the column definitions and data mapping logic

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('Date', {
        header: 'schedule',
        cell: ({ row }) => <Typography>{formatDayTime(row.original)}</Typography>
      }),
      columnHelper.accessor('state', {
        header: 'State',
        cell: ({ row }) => (
          <Chip
            label={row.original.state ?? 'No change'}
            color={
              row.original.state === 'ENABLED' ? 'success' : row.original.state === 'PAUSED' ? 'warning' : 'primary'
            }
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('budget', {
        header: 'Budget',
        cell: ({ row }) => <Typography>{formatUSD(row.original.budget)}</Typography>
      }),

      columnHelper.accessor('active', {
        header: 'Status',
        cell: ({ row }) => <ChangeStatus row={row.original} />
      }),

      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: ({ row }) => <Typography>{convertToDateOnly(row.original.updatedAt)}</Typography>
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Delete id={row.original} />

            <UpdateCampaginScheduleModal data={row} />
            <IconButton>
              <i className='tabler-report text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [data, page, resultsPerPage]
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
        pageSize: resultsPerPage
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
    if (SceduleData) {
      setData(SceduleData)
    }
  }, [SceduleData, page, resultsPerPage])

  return (
    <>
      {/* <Card>
        <CardHeader title='Filters' /> */}
      <div className=' w-[100%]'>
        <div className=' w-[100%] max-md:w-[100%]'>
          <div className=' w-full flex items-center gap-3'>
            <Typography>Name: {Campagindata?.campaignName}</Typography>
          </div>
          <div className=' w-full flex items-center gap-3'>
            <Typography>Budget: {formatUSD(Campagindata?.campaignBudget)}</Typography>
          </div>
          <div className=' w-full flex items-center gap-3'>
            <Typography>
              State:{' '}
              <Chip
                label={Campagindata.campaignState}
                color={Campagindata.campaignState === 'ENABLED' ? 'success' : 'warning'}
                variant='tonal'
                size='small'
              />
            </Typography>
          </div>
        </div>
      </div>
      <div className=' w-full flex flex-wrap justify-end gap-4 p-6'>
        <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto w-full justify-end'>
          {/* <Button
            onClick={() => {
              setOpenCreateScedule(true)
              setSingleSceduleData(Campagindata)
            }}
            variant='contained'
            className='max-sm:is-full is-auto'
            startIcon={<i className='tabler-plus' />}
          >
            <span className=' max-md:hidden'>Add Scedule</span>
          </Button> */}

          <CreateSceduleModal data={[Campagindata]} />
        </div>
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
                  {[...Array(11)].map((_, colIndex) => (
                    <td key={colIndex}>
                      <Skeleton variant='text' />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : table.getFilteredRowModel().rows?.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => (
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

export default ScedulesTable
