'use client'
import React, { type ChangeEventHandler, useState } from 'react'

import { Button, Chip, IconButton, InputAdornment, ListItemIcon, ListItemText, Switch, Typography } from '@mui/material'
import { CalendarPlus, Check, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import { convertToDateOnly } from '@/utils/dateConverter'
import UpdateEmployeePassword from '../addprofile/UpdateEmployeePassword'
import { type UserData } from '@/typs/user.type'
import CreateEmployee from '../addprofile/CreateEmployee'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import ProductTable from './product/ProductTable'
import SceduleTable from './schedule/SceduleTable'
import CampaginHistory from './CampaginHistory'
import CreateCampaginSchedule from './schedule/CreateCampaginSchedule'
import { useSearchParams } from 'next/navigation'
import { MenuItem } from '@/components/Menu'
import CustomTextField from '@/@core/components/mui/TextField'
import { debounce } from 'lodash'

const handleCopy = (text: string) => {
  copy(text)
  toast.success('Email Copied to Clipboard')
}
const CampaginTable = ({ data, handleClose }: { data?: any; handleClose?: () => void }) => {
  console.log(data, 'data of add profile')
  const searchParams = useSearchParams()

  const id = searchParams.get('profileId')
  console.log(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [profileId, setProfileId] = useState(id)
  const [state, setState] = useState('')

  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [openProductTable, setOpenProductTable] = useState(false)
  const [openSceduleTable, setOpenSceduleTable] = useState(false)

  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleCampaginData, setSingleCampaginData] = useState<any>(null as any)
  const [openCampaginHistory, setOpenCampaginHistory] = useState(false)
  const [selcteData, setSelcteData] = useState([])
  const [openCreateScedule, setOpenCreateScedule] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  console.log(selcteData, 'selected Data')

  const { companyUsers } = useUserStore()
  const session = useSession()

  const headers = [
    // { key: 'id', label: 'Campaign ID' },

    // { key: 'companyId', label: 'Company ID' },

    // { key: 'profileId', label: 'Profile ID' },

    { key: 'campaignName', label: 'Name' },
    { key: 'campaignType', label: 'Campaign Type' },

    {
      key: 'totalProducts',
      label: 'Products',
      render: (row: any) => (
        <div
          onClick={() => {
            setSingleCampaginData(row)
            setOpenProductTable(true)
          }}
        >
          <span className={` cursor-pointer ${row?.totalProducts > 0 ? ' text-blue-600' : 'text-blue-600'}`}>
            {' '}
            {row?.totalProducts}
          </span>
        </div>
      )
    },
    { key: 'totalKeywords', label: 'Keywords' },

    { key: 'campaignBudget', label: 'Budget', render: (row: any) => <span>${row.campaignBudget}</span> },
    {
      key: 'activeSchedule',
      label: 'Schedule',
      render: (row: any) => (
        <span
          onClick={() => {
            setSingleCampaginData(row)
            setOpenSceduleTable(true)
          }}
          className=' font-bold cursor-pointer'
        >
          <span className=' text-green-800'>{row.activeSchedule}</span>/{row.inActiveSchedule}
        </span>
      )
    },
    {
      key: 'campaignState',
      label: 'State',
      render: (row: any) => (
        <span
          style={{
            color: row.campaignState === 'PAUSED' ? '#a16207' : row.campaignState === 'ARCHIVED' ? '#7f1d1d' : '#14532d'
          }}
        >
          <Chip
            label={row.campaignState}
            color={row.campaignState === 'ENABLED' ? 'success' : 'warning'}
            variant='tonal'
          />
        </span>
      )
    },
    { key: 'campaignStartDate', label: 'Start Date', render: (row: any) => convertToDateOnly(row.campaignStartDate) },
    {
      key: 'campaignEndDate',
      label: 'End Date',
      render: (row: any) =>
        row.campaignEndDate === '0001-01-01T00:00:00Z' ? '-' : convertToDateOnly(row.campaignEndDate)
    }

    // { key: 'inActiveSchedule', label: 'Inactive Schedule' },

    // { key: 'totalAdGroups', label: 'Total Ad Groups' },

    // { key: 'totalKeywords', label: 'Total Keywords' }
  ]
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
      : `/advertising/stats/campaigns?page=${page}&page_size=${resultsPerPage}${profileId ? `&profile_id=${profileId}` : ''}${state ? `&state=${state}` : ''}`
  )

  const tableData = searchInput ? combinedData?.campaigns : combinedData?.campaigns
  const totalRecords = searchInput ? combinedData?.meta?.totalRecords : combinedData?.meta?.totalRecords

  const { data: addProfileData, isLoading: ProfileDataLoading } = useFetchData(
    ['addProfileData'],
    `/advertising/profiles`
  )

  const actionElements = (row: any) => (
    <div>
      {/* <div className=' flex flex-col gap-2 p-[1%] z-[999]'> */}
      <MenuItem>
        <ListItemIcon>
          <i className='tabler-calendar-check text-xl' />
        </ListItemIcon>
        <ListItemText primary='Schedule' />
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpenCampaginHistory(true)
        }}
      >
        <ListItemIcon>
          <i className='tabler-history text-xl' />
        </ListItemIcon>
        <ListItemText primary='History' />
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpenCampaginHistory(true)
        }}
      >
        <ListItemIcon>
          <i className='tabler-pencil text-xl' />
        </ListItemIcon>
        <ListItemText primary='Edit' />
      </MenuItem>

      {/* </div> */}
    </div>
  )

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    console.log('Changed value:', e.target.value)
    setSearchInput(e.target.value)
  }

  const handelSearch = debounce(onChange, 500)

  return (
    <>
      {/* <div className='flex relative justify-center flex-col items-center bs-full bg-backgroundPaper !min-is-full  md:!min-is-[unset] md:is-[800px] md:rounded'> */}
      <div className='flex w-full items-center gap-[1rem] my-[1%]'>
        <div className='w-[30%]'>
          <CustomTextField
            select
            fullWidth
            defaultValue=''
            label='Select Profile'
            id='custom-select'
            value={profileId}
            onChange={e => {
              setProfileId(e.target.value)
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='end'>
                    <i className='tabler-x cursor-pointer' onClick={() => setProfileId('')} />
                  </InputAdornment>
                )
              }
            }}
          >
            {addProfileData?.profiles?.map((item: any, index: number) => (
              <MenuItem key={index} value={item?.id} className='text-gray-950'>
                {item?.countryCode}/{item?.accountName}{' '}
              </MenuItem>
            ))}
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
      <div className=' w-full '>
        <Table
          headers={headers}
          selectionId='id'
          csv={false}
          data={tableData}
          action={true}
          number={totalRecords}
          page={page}
          setPage={setPage}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          loading={combinedLoading}
          setLoading={() => {}}
          actionElements={actionElements}
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
          isSlectedDataRequired={true}
          setSelcteData={setSelcteData}
          tableTitle={
            <div className='flex items-center gap-[1rem]'>
              {selcteData.length > 0 && (
                <Button
                  variant='contained'
                  onClick={() => {
                    setOpenCreateScedule(true)
                  }}
                >
                  <CalendarPlus />
                  <span className='max-md:hidden'>Add Schedule</span>
                </Button>
              )}
              <div>
                <CustomTextField
                  id='input-with-icon-adornment'
                  label=''
                  placeholder='search...'
                  onChange={handelSearch}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-search' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </div>
            </div>
          }
        />
      </div>

      <DialogComponent
        open={OpenEmplyeePassword}
        handleClose={() => setOpenEmplyeePassword(false)}
        data={singleCampaginData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateEmployeePassword data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent open={openCreateEployee} handleClose={() => setOpenCreateEployee(false)} data={id}>
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateEmployee handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent
        open={openProductTable}
        handleClose={() => setOpenProductTable(false)}
        data={singleCampaginData}
        maxWidth='xl'
        title={`Campaign Products ( ${singleCampaginData?.campaignName})
`}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <ProductTable data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent
        open={openCampaginHistory}
        handleClose={() => setOpenCampaginHistory(false)}
        data={singleCampaginData}
        maxWidth='xl'
        title='Campagin Logs'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CampaginHistory data={data} handleClose={handleClose} />
        )}
      </DialogComponent>

      <DialogComponent
        open={openSceduleTable}
        handleClose={() => setOpenSceduleTable(false)}
        data={singleCampaginData}
        maxWidth='xl'
        title='Scedule'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <SceduleTable data={data} handleClose={handleClose} />
        )}
      </DialogComponent>

      <DialogComponent
        open={openCreateScedule}
        handleClose={() => setOpenCreateScedule(false)}
        data={selcteData}
        title='Create Schedule'
        maxWidth='md'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateCampaginSchedule data={selcteData} handleClose={handleClose} />
        )}
      </DialogComponent>
      {/* </div> */}
    </>
  )
}

export default CampaginTable

const VerifiedRenderHandeler = ({ row }: any) => {
  return (
    <button
      style={{ color: row?.user?.emailVerified ? 'rgb(27, 94, 32)' : 'rgb(183, 28, 28)' }}
      className=' bg-transparent '
    >
      <div>{row?.user?.emailVerified ? <Check className='size-[1rem]' /> : <X className='size-[1rem]' />}</div>
    </button>
  )
}
