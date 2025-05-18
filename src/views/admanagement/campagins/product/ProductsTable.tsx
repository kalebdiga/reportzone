'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports

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
import ProductPlaceHolder from './../../../../../public/images/product.jpg'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { convertToDateOnly } from '@/utils/dateConverter'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useSession } from 'next-auth/react'
import { useFetchData } from '@/apihandeler/useFetchData'
import TableFilters from '@/components/TableFilters'
import { Skeleton } from '@mui/material'
import Image from 'next/image'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
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
const columnHelper = createColumnHelper<any>()

// Update the column definitions and data mapping logic

const ProductsTable = ({ data: CampaginData, handleClose }: { data?: any; handleClose?: () => void }) => {
  //('CampaginData', CampaginData)
  const { companyUsers } = useUserStore()
  const session = useSession()
  const router = useRouter()
  const id = CampaginData?.id
  const company_id = CampaginData?.companyId
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)

  const { data: ProductData, isLoading } = useFetchData(
    ['products', session?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/advertising/campaigns/${id}/products?company_id=${company_id}`
  )

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(ProductData?.products ?? [])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('image', {
        header: 'Product ',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <Image
              src={row.original.image ?? ProductPlaceHolder}
              width={38}
              height={38}
              className='rounded bg-actionHover'
              alt='Product image'
            />

            <div className='flex flex-col '>
              <Typography>{row.original.name.slice(0, 32) ?? '-'}...</Typography>
            </div>
          </div>
        )
      }),

      // columnHelper.accessor('AdProduct', {
      //   header: 'Product Name',
      //   cell: ({ row }) => <Typography>{row.original.name}</Typography>
      // }),

      columnHelper.accessor('sku', {
        header: 'SKU',
        cell: ({ row }) => <Typography>{row.original.sku}</Typography>
      }),
      columnHelper.accessor('asin', {
        header: 'ASIN',
        cell: ({ row }) => <Typography>{row.original.asin}</Typography>
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
    if (ProductData?.products) {
      setData(ProductData?.products)
    }
  }, [ProductData?.products, data])
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
      <TablePagination
        component={() => (
          <TablePaginationComponent
            count={ProductData?.meta?.totalRecords || 0}
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
        count={ProductData?.meta?.totalRecords || 0}
        rowsPerPage={resultsPerPage}
        page={page - 1}
        onPageChange={(_, newPage) => {
          setPage(newPage + 1)
        }}
      />
    </>
  )
}

export default ProductsTable
