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
import TableSkeleton from '@/utils/TableSkleton'
import { Skeleton } from '@mui/material'

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

// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>()

// Update the column definitions and data mapping logic

const AdsTable = () => {
  const { companyUsers } = useUserStore()
  const datas = useSession()
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)

  const { data: addProfileData, isLoading } = useFetchData(
    ['addProfileData', datas?.data?.user?.accessToken, companyUsers[0]?.companyId],
    `/advertising/profiles`
  )

  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(addProfileData?.profiles || [])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('accountName', {
        header: 'Account Name',
        cell: ({ row }) => <Typography>{row.original.accountName}</Typography>
      }),
      columnHelper.accessor('countryCode', {
        header: 'Country Code',
        cell: ({ row }) => <Typography>{row.original.countryCode}</Typography>
      }),
      columnHelper.accessor('totalCampaigns', {
        header: 'Campaigns',
        cell: ({ row }) => (
          <Typography
            className=' text-blue-700 cursor-pointer'
            onClick={() => {
              router.push(`campagines?profileId=${row?.original?.id}&companyId=${row?.original.companyId}`)
            }}
          >
            {row.original.totalCampaigns}
          </Typography>
        )
      }),

      columnHelper.accessor('isActive', {
        header: 'Active',
        cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? 'Active' : 'Inactive'}
            color={row.original.isActive ? 'success' : 'warning'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => <Typography>{convertToDateOnly(row.original.createdAt)}</Typography>
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: ({ row }) => <Typography>{convertToDateOnly(row.original.updatedAt)}</Typography>
      })
    ],
    [data, addProfileData?.profiles, addProfileData]
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
    if (addProfileData?.profiles) {
      setData(addProfileData.profiles)
    }
  }, [addProfileData?.profiles, addProfileData])

  return (
    <>
      <Card>
        <div className='flex flex-wrap justify-end gap-4 p-6'>
          <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
            <Button
              variant='contained'
              component={Link}
              className='max-sm:is-full is-auto'
              href={'/'}
              startIcon={<i className='tabler-link' />}
            >
              <span className=' max-md:hidden'>Link Profile</span>
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
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
                    {[...Array(6)].map((_, colIndex) => (
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
        <TablePagination
          component={() => (
            <TablePaginationComponent
              count={addProfileData?.meta?.totalRecords || 0}
              rowsPerPage={resultsPerPage}
              page={page - 1}
              onPageChange={(_, newPage) => {
                setPage(newPage)
              }}
              onRowsPerPageChange={e => {
                const newRowsPerPage = parseInt(e.target.value, 10)
                setResultsPerPage(newRowsPerPage)
                setPage(1)
              }}
              setResultsPerPage={setResultsPerPage}
            />
          )}
          count={addProfileData?.meta?.totalRecords || 0}
          rowsPerPage={resultsPerPage}
          page={page - 1}
          onPageChange={(_, newPage) => {
            setPage(newPage + 1)
          }}
        />
      </Card>
    </>
  )
}

export default AdsTable
