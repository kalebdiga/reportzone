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
import DialogComponent from '@/components/layout/shared/DialogsSizes'

import CampaginHistory from './CampaginHistory'
import CreateCampaginSchedule from './schedule/CreateCampaginSchedule'
import ScedulesTable from './schedule/ScedulesTable'
import { Checkbox, Skeleton } from '@mui/material'
import ProductsTable from './product/ProductsTable'
import { formatUSD } from '@/utils/usdFormat'
import { useCampaignLogModal } from './modals/hook'
import UpdateCampagin from './UpdateCampagin'
import CampaginKeyModal from './keys/CampaginKeyModal'

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

const CampaginTables = () => {
  const searchParams = useSearchParams()
  const { user, companyUsers: fromeStore } = useUserStore()
  const session = useSession()
  const { trigger, menuOption, dialog } = useCampaignLogModal()

  const { companyUsers } = useUserStore()

  const id = searchParams.get('profileId')
  const companyId = searchParams.get('companyId')
  console.log(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [profileId, setProfileId] = useState(id)
  const [state, setState] = useState('')
  const [company_id, setCompany_id] = useState(companyId)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [openProductTable, setOpenProductTable] = useState(false)
  const [openSceduleTable, setOpenSceduleTable] = useState(false)
  const [openUpdateCampagin, setOpenUpdateCampagin] = useState(false)

  const [OpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleCampaginData, setSingleCampaginData] = useState<any>(null as any)
  const [openCampaginHistory, setOpenCampaginHistory] = useState(false)
  const [selcteData, setSelcteData] = useState([])
  const [openCreateScedule, setOpenCreateScedule] = useState(false)
  const [searchInput, setSearchInput] = useState<string | number>('')

  const { data: combinedData, isLoading: combinedLoading } = useFetchData(
    [
      searchInput ? 'searchCampagin' : 'capaignData',
      session?.data?.user?.accessToken,
      companyUsers[0]?.companyId,
      page,
      resultsPerPage,
      profileId,
      state,
      searchInput
    ],
    searchInput
      ? `/advertising/search/campaigns?${profileId ? `profile_id=${profileId}&` : ''}search=${searchInput}`
      : `/advertising/stats/campaigns?${user?.globalRole ? `${company_id ? `company_id=${company_id}&` : ''}sort_by=active_schedules_count&sort_order=desc` : ''}${profileId ? `&profile_id=${profileId}` : ''}&page=${page}&page_size=${resultsPerPage}${state ? `&state=${state}` : ''}`
  )

  const tableData = searchInput ? combinedData?.campaigns : combinedData?.campaigns

  // console.log('data', productData)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(tableData?.profiles || [])
  const [globalFilter, setGlobalFilter] = useState('')

  // Update the column definitions and data mapping logic
  console.log(combinedData?.meta?.totalRecords)
  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table?.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('campaignName', {
        header: 'Campaign Name',
        cell: ({ row }) => <Typography>{row.original.campaignName}</Typography>
      }),
      columnHelper.accessor('campaignType', {
        header: 'Campaign Type',
        cell: ({ row }) => <Typography>{row.original.campaignType}</Typography>
      }),
      columnHelper.accessor('campaignBudget', {
        header: 'Budget',
        cell: ({ row }) => <Typography>{formatUSD(row.original.campaignBudget)}</Typography>
      }),

      columnHelper.accessor('totalProducts', {
        header: 'Products',
        cell: ({ row }) => (
          <Typography
            onClick={() => {
              setSingleCampaginData(row.original)
              setOpenProductTable(true)
            }}
            className=' text-blue-900 cursor-pointer'
          >
            {row.original.totalProducts}
          </Typography>
        )
      }),
      columnHelper.accessor('totalKeywords', {
        header: 'Keywords',
        cell: ({ row }) => <CampaginKeyModal data={row} />
      }),

      columnHelper.accessor('campaignScedule', {
        header: 'Schedule',
        cell: ({ row }) => (
          <Typography
            onClick={() => {
              setSingleCampaginData(row.original)
              setOpenSceduleTable(true)
            }}
            className=' font-bold cursor-pointer'
          >
            {' '}
            <span className=' text-green-800'>{row.original.activeSchedule}</span>/{row.original.inActiveSchedule}
          </Typography>
        )
      }),

      columnHelper.accessor('campaignState', {
        header: 'Campaign State',
        cell: ({ row }) => (
          <Chip
            label={row.original.campaignState}
            color={row.original.campaignState === 'PAUSED' ? 'warning' : 'success'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('campaignStartDate', {
        header: 'Start Date',
        cell: ({ row }) => <Typography>{convertToDateOnly(row.original.campaignStartDate)}</Typography>
      }),
      columnHelper.accessor('campaignEndDate', {
        header: 'End Date',
        cell: ({ row }) =>
          row.original.campaignEndDate === '0001-01-01T00:00:00Z' ? (
            <Typography>Ongoing</Typography>
          ) : (
            <Typography>{convertToDateOnly(row.original.campaignEndDate)}</Typography>
          )
      }),

      // columnHelper.accessor('totalAdGroups', {
      //   header: 'Ad Groups',
      //   cell: ({ row }) => <Typography fontSize={".75rem"}>{row.original.totalAdGroups}</Typography>
      // }),

      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => {
          // const rowData = row

          return (
            <div className='flex items-center'>
              {trigger(row)}

              <OptionMenu
                iconButtonProps={{ size: 'medium' }}
                iconClassName='text-textSecondary'
                options={[
                  {
                    text: 'Schedule',
                    icon: 'tabler-calendar-plus',
                    menuItemProps: {
                      onClick: () => {
                        setSingleCampaginData(row.original)
                        setOpenSceduleTable(true)
                      }
                    }
                  },
                  menuOption(row), // Logs with data
                  {
                    text: 'Edit',
                    icon: 'tabler-edit',
                    menuItemProps: {
                      onClick: () => {
                        setSingleCampaginData(row.original)
                        setOpenUpdateCampagin(true)
                      }
                    }
                  }
                ]}
              />
            </div>
          )
        },
        enableSorting: false
      })
    ],
    [data, tableData?.profiles, combinedData, page, resultsPerPage]
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
        pageSize: 100
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
    if (tableData) {
      setData(tableData)
    }
  }, [tableData, page, resultsPerPage])

  const { data: addProfileData, isLoading: ProfileDataLoading } = useFetchData(
    ['addProfileData'],
    `/advertising/profiles`
  )

  console.log('Selected Data:', profileId)
  const [selectedProfile, setSelectedProfile] = useState(
    JSON.stringify({
      pi: id,
      ci: companyId
    })
  ) // holds the JSON string

  return (
    <>
      <Card>
        <CardHeader title='Filters' />
        <div className='flex flex-wrap  gap-4 p-6'>
          <div className=' w-[30%] '>
            <CustomTextField
              select
              fullWidth
              label='Select Profile'
              id='custom-select'
              value={selectedProfile}
              onChange={e => {
                const value = e.target.value
                const parsedValue = JSON.parse(value)
                console.log(parsedValue)
                setSelectedProfile(value) // store full JSON string
                setProfileId(parsedValue?.pi)
                setCompany_id(parsedValue?.ci)
              }}
            >
              {addProfileData?.profiles?.length > 0 ? (
                addProfileData.profiles.map((item: any, index: number) => {
                  const optionValue = JSON.stringify({ pi: item?.id, ci: item?.companyId })
                  return (
                    <MenuItem key={index} value={optionValue} className='text-gray-950'>
                      {item?.countryCode || 'Unknown Country'}/{item?.accountName || 'Unknown Account'}
                    </MenuItem>
                  )
                })
              ) : (
                <MenuItem disabled>No Profiles Available</MenuItem>
              )}
            </CustomTextField>
          </div>

          <div className='w-[30%]'>
            <CustomTextField
              select
              fullWidth
              defaultValue=''
              label='Select Profile'
              id='custom-select'
              value={state}
              onChange={e => {
                setState(e.target.value)
              }}
            >
              {['', 'ENABLED', 'PAUSED', 'ARCHIVED']?.map((item: any, index: number) => (
                <MenuItem key={index} value={item} className='text-gray-950'>
                  {item}
                </MenuItem>
              ))}
            </CustomTextField>
          </div>
        </div>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <div className=' w-[50%] flex gap-[1rem]'>
            {table.getSelectedRowModel().rows.length > 0 && (
              <Button
                variant='contained'
                className='max-sm:is-full is-auto'
                startIcon={<i className='tabler-plus' />}
                onClick={() => {
                  setOpenCreateScedule(true)
                }}
              >
                <span className='max-md:hidden'>Add schedule</span>
              </Button>
            )}
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setSearchInput(value)}
              placeholder='Search'
              className='max-sm:is-full'
            />
          </div>

          <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'></div>
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
            {combinedLoading ? (
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
        <TablePagination
          component={() => (
            <TablePaginationComponent
              count={combinedData?.meta?.totalRecords || 0}
              rowsPerPage={resultsPerPage}
              page={page - 1}
              onPageChange={(_, newPage) => {
                setPage(newPage)
              }}
              onRowsPerPageChange={e => {
                const newRowsPerPage = parseInt(e.target.value)
                setResultsPerPage(newRowsPerPage)
                setPage(1)
              }}
              setResultsPerPage={setResultsPerPage}
            />
          )}
          count={combinedData?.meta?.totalRecords || 0}
          rowsPerPage={resultsPerPage}
          page={page - 1}
          onPageChange={(_, newPage) => {
            setPage(newPage + 1)
          }}
        />
      </Card>

      <DialogComponent
        open={openProductTable}
        handleClose={() => setOpenProductTable(false)}
        data={singleCampaginData}
        maxWidth='md'
        title={`Campaign Products ( ${singleCampaginData?.campaignName})
      `}
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <ProductsTable data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent
        open={openCampaginHistory}
        handleClose={() => setOpenCampaginHistory(false)}
        data={singleCampaginData}
        maxWidth='xl'
        title='Campagin Logs'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <CampaginHistory data={data} handleClose={handleClose} />
        )}
      </DialogComponent>

      <DialogComponent
        open={openSceduleTable}
        handleClose={() => setOpenSceduleTable(false)}
        data={singleCampaginData}
        maxWidth='md'
        title='schedule'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <ScedulesTable Campagindata={data} handleClose={handleClose} />
        )}
      </DialogComponent>

      <DialogComponent
        open={openUpdateCampagin}
        handleClose={() => setOpenUpdateCampagin(false)}
        data={singleCampaginData}
        maxWidth='sm'
        title='Update campagin'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <UpdateCampagin data={data} handleClose={handleClose} />
        )}
      </DialogComponent>

      <DialogComponent
        open={openCreateScedule}
        handleClose={() => setOpenCreateScedule(false)}
        data={table.getSelectedRowModel().rows}
        title='Create Schedule'
        maxWidth='md'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <CreateCampaginSchedule data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      {dialog}
    </>
  )
}

export default CampaginTables
