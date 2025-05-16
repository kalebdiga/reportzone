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
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { type UserData } from '@/typs/user.type'
import CreateCompany from './CreateCompany'
import UpdateCompany from './UpdateCompany'
import ChangeStatus from './ChangeStatus'
import CompanyEmployeeTable from './employee/CompanyEmployeeTable'
import { Skeleton } from '@mui/material'
import { divide } from 'lodash'

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

// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>()

// Update the column definitions and data mapping logic

const CompanyesTable = () => {
  //state
  const datas = useSession()

  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyee, setOpenEmplyee] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleCompanyData, setSingleCompanyData] = useState<any>(null as any)

  //hooks
  const { data: CompanyData, isLoading } = useFetchData(
    ['companyData', datas?.data?.user?.accessToken, page, resultsPerPage],
    `/companies?page_size=${resultsPerPage}&page=${page}`
  )

  // console.log('data', productData)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(CompanyData?.companies || [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [singleEmployeeData, setSingleEmployeeData] = useState<UserData>(null as any)

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <ChangeStatus row={row.original} />
      }),
      columnHelper.accessor('totalEmployee', {
        header: 'Employees',
        cell: ({ row }) => (
          <Typography
            className='cursor-pointer text-blue-600'
            onClick={() => {
              setSingleCompanyData(row.original)
              setOpenEmplyee(true)
            }}
          >
            {row.original.totalEmployee}
          </Typography>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => <Typography>{convertToDateOnly(row.original.createdAt)}</Typography>
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: ({ row }) => <Typography>{convertToDateOnly(row.original.updatedAt)}</Typography>
      }),

      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setSingleCompanyData(row.original)
                setOpenEmplyeeProfile(true)
              }}
            >
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [data, CompanyData?.companies]
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
    if (CompanyData?.companies) {
      setData(CompanyData?.companies)
    }
  }, [CompanyData?.companies])

  return (
    <>
      <Card>
        <div className='flex flex-wrap justify-end gap-4 p-6'>
          <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='flex-auto is-[70px] max-sm:is-full'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>

            <Button
              variant='contained'
              className='max-sm:is-full is-auto'
              onClick={() => {
                setOpenCreateEployee(true)
              }}
              startIcon={<i className='tabler-plus' />}
            >
              <span className=' max-md:hidden'>Add Company</span>
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
              count={CompanyData?.meta?.totalRecords || 0}
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
          count={CompanyData?.meta?.totalRecords || 0}
          rowsPerPage={resultsPerPage}
          page={page - 1}
          onPageChange={(_, newPage) => {
            setPage(newPage + 1)
          }}
        />
      </Card>
      <DialogComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={singleCompanyData}
        title='Update Company'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <UpdateCompany data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent
        maxWidth='lg'
        open={OpenEmplyee}
        handleClose={() => setOpenEmplyee(false)}
        data={singleCompanyData}
        title={`${singleCompanyData?.name}/Employees`}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CompanyEmployeeTable handleClose={handleClose} data={data} />
        )}
      </DialogComponent>
      <DialogComponent
        open={openCreateEployee}
        handleClose={() => setOpenCreateEployee(false)}
        maxWidth='sm'
        title='Create Company'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateCompany handleClose={handleClose} id={data} />
        )}
      </DialogComponent>
    </>
  )
}

export default CompanyesTable
