'use client'
import React, { useState } from 'react'

import { Button, IconButton, Switch, Typography } from '@mui/material'
import {
  ArrowLeft,
  CalendarCheck,
  CalendarPlus,
  Check,
  Copy,
  FileClock,
  LockKeyhole,
  Pencil,
  Plus,
  X
} from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import { date } from 'yup'
import { convertToDateOnly } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'
import ModalComponent from '@/components/layout/shared/ModalComponent'
import UpdateEmployeePassword from '../addprofile/UpdateEmployeePassword'
import { type UserData } from '@/typs/user.type'
import CreateEmployee from '../addprofile/CreateEmployee'
import ChangeEployeeStatus from '../../employees/ChangeEployeeStatus'
import Link from 'next/link'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import ProductTable from './product/ProductTable'
import SceduleTable from './schedule/SceduleTable'
import CampaginHistory from './CampaginHistory'
import CreateCampaginSchedule from './schedule/CreateCampaginSchedule'

const handleCopy = (text: string) => {
  copy(text)
  toast.success('Email Copied to Clipboard')
}
const CampaginTable = ({ data, handleClose }: { data?: any; handleClose?: () => void }) => {
  const id = data?.id
  console.log(data, 'data of add profile')

  console.log(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [openProductTable, setOpenProductTable] = useState(false)
  const [openSceduleTable, setOpenSceduleTable] = useState(false)

  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleCampaginData, setSingleCampaginData] = useState<UserData>(null as any)
  const [openCampaginHistory, setOpenCampaginHistory] = useState(false)
  const [selcteData, setSelcteData] = useState([])
  const [openCreateScedule, setOpenCreateScedule] = useState(false)

  console.log(selcteData, 'selected Data')

  const { companyUsers } = useUserStore()
  const session = useSession()

  const headers = [
    // { key: 'id', label: 'Campaign ID' },

    // { key: 'companyId', label: 'Company ID' },

    // { key: 'profileId', label: 'Profile ID' },

    { key: 'campaignName', label: 'Name' },
    { key: 'campaignType', label: 'Type' },

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
          <span className={`${row?.totalProducts > 0 ? ' text-blue-600' : 'text-blue-600'}`}>
            {' '}
            {row?.totalProducts}
          </span>
        </div>
      )
    },
    { key: 'totalKeywords', label: 'Keywords' },

    { key: 'campaignBudget', label: 'Budget', render: (row: any) => <span>${row.campaignBudget}</span> },

    {
      key: 'campaignState',
      label: 'State',
      render: (row: any) => (
        <span
          style={{
            color: row.campaignState === 'PAUSED' ? '#a16207' : row.campaignState === 'ARCHIVED' ? '#7f1d1d' : '#14532d'
          }}
        >
          {row.campaignState}
        </span>
      )
    },
    { key: 'campaignStartDate', label: 'Start Date', render: (row: any) => convertToDateOnly(row.campaignStartDate) },
    {
      key: 'campaignEndDate',
      label: 'End Date',
      render: (row: any) =>
        row.campaignEndDate === '0001-01-01T00:00:00Z' ? '-' : convertToDateOnly(row.campaignEndDate)
    },
    {
      key: 'activeSchedule',
      label: 'Schedule',
      render: (row: any) => (
        <span
          onClick={() => {
            setSingleCampaginData(row)
            setOpenSceduleTable(true)
          }}
        >
          {row.activeSchedule}/{row.inActiveSchedule}
        </span>
      )
    }

    // { key: 'inActiveSchedule', label: 'Inactive Schedule' },

    // { key: 'totalAdGroups', label: 'Total Ad Groups' },

    // { key: 'totalKeywords', label: 'Total Keywords' }
  ]
  const { data: CampaginData, isLoading } = useFetchData(
    ['CompanyEmployees', session?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/advertising/stats/campaigns?page=${page}&page_size=${resultsPerPage}${id ? `&profile_id=${id}` : ''}`
  )

  const handleActionClick = (row: any) => {}
  const actionElements = (row: any) => (
    <div className=' flex flex-col gap-2 p-[1%] z-[999]'>
      <div className='flex items-center gap-2 '>
        <CalendarCheck className='size-[1rem]' />
        <span> Schedule</span>
      </div>

      <div
        className='flex items-center gap-2 '
        onClick={() => {
          setOpenCampaginHistory(true)
        }}
      >
        <FileClock className='size-[1rem]' />
        <span>History</span>
      </div>

      <div className='flex items-center gap-2 '>
        <Pencil className='size-[1rem]' />
        <span> Edit</span>
      </div>
    </div>
  )
  if (isLoading) {
    return (
      <div className=' is-[800px]'>
        <TableSkeleton />
      </div>
    )
  }
  return (
    <>
      {/* <div className='flex relative justify-center flex-col items-center bs-full bg-backgroundPaper !min-is-full  md:!min-is-[unset] md:is-[800px] md:rounded'> */}

      <div className=' w-full '>
        <Table
          headers={headers}
          selectionId='id'
          csv={false}
          data={CampaginData?.campaigns}
          action={true}
          number={CampaginData?.meta?.totalRecords}
          page={page}
          setPage={setPage}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          loading={false}
          setLoading={() => {}}
          actionElements={actionElements}
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
          isSlectedDataRequired={true}
          setSelcteData={setSelcteData}
          tableTitle={
            selcteData.length > 0 && (
              <Button
                variant='contained'
                onClick={() => {
                  setOpenCreateScedule(true)
                }}
              >
                <CalendarPlus />
                <span className=' max-md:hidden'>Add Scedule</span>
              </Button>
            )
          }
        />
      </div>

      <ModalComponent
        open={OpenEmplyeePassword}
        handleClose={() => setOpenEmplyeePassword(false)}
        data={singleCampaginData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateEmployeePassword data={data} handleClose={handleClose} />
        )}
      </ModalComponent>
      <ModalComponent open={openCreateEployee} handleClose={() => setOpenCreateEployee(false)} data={id}>
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateEmployee handleClose={handleClose} />
        )}
      </ModalComponent>
      <DialogComponent
        open={openProductTable}
        handleClose={() => setOpenProductTable(false)}
        data={singleCampaginData}
        maxWidth='xl'
        title='Product'
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
        title='Campagin'
        maxWidth='xl'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <div className=' max-w-[100%]'>
            <CreateCampaginSchedule data={selcteData} handleClose={handleClose} />
          </div>
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
