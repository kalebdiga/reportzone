'use client'
import React, { useState } from 'react'

import { Button, Chip, IconButton, Switch, Typography } from '@mui/material'
import { ArrowLeft, Check, Copy, LockKeyhole, Pencil, Plus, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import { date } from 'yup'
import { convertToDateOnly, formatDateToDayAndTime, formatDayTime } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'
import ModalComponent from '@/components/layout/shared/ModalComponent'
import { type UserData } from '@/typs/user.type'
import Link from 'next/link'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import ChangeEployeeStatus from '@/views/company/ChangeStatus'
import { Form, Formik } from 'formik'
import FormikTextField from '@/lib/form/FormikInput'
import FormikDropdown from '@/lib/form/FormikDropDown'
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import CreateCampaginSchedule from './CreateCampaginSchedule'
import SadowlessTable from '@/components/layout/shared/table/SadowlessTable'

const handleCopy = (text: string) => {
  copy(text)
  toast.success('Email Copied to Clipboard')
}
const SceduleTable = ({ data, handleClose }: { data?: any; handleClose?: () => void }) => {
  const id = data?.id
  console.log(data, 'data of add profile')

  console.log(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [openCreateScedule, setOpenCreateScedule] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleSceduleData, setSingleSceduleData] = useState<UserData>(null as any)

  //hooks

  const { companyUsers } = useUserStore()
  const session = useSession()

  const headers = [
    {
      key: 'createdAt',
      label: 'Schedule',
      render: (row: any) => formatDayTime(row)
    },
    {
      key: 'state',
      label: 'State',
      render: (row: any) => (
        <Chip
          label={row.state ?? '-'}
          color={row.state === 'ENABLED' ? 'success' : row.state === 'PAUSED' ? 'warning' : 'error'}
          variant='tonal'
        />

        // <span
        //   style={{
        //     color: row.state === 'PAUSED' ? '#a16207' : row.state === 'ARCHIVED' ? '#7f1d1d' : '#14532d'
        //   }}
        // >
        //   {row.state}
        // </span>
      )
    },
    { key: 'budget', label: 'Budget', render: (row: any) => (row.budget ? `$${row.budget}` : '-') },
    { key: 'active', label: 'Status', render: (row: any) => <ChangeEployeeStatus row={row} /> }
  ]
  const { data: SceduleData, isLoading } = useFetchData(
    ['products', session?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/schedules?campaignId=${id}`
  )
  const handleActionClick = (row: any) => {
    setSingleSceduleData(row)
    setOpenEmplyeeProfile(true)
  }
  const actionElements = (row: any) => (
    <div className=' flex flex-col gap-2 p-[1%] z-[999]'>
      <Button variant='outlined' onClick={() => handleActionClick(row)}>
        <div className='flex items-center gap-2 '>
          <Pencil className='size-[1rem]' />
          <span> Edit</span>
        </div>
      </Button>
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
      <div className=' flex justify-between items-center my-[3%]'>
        <div className=' w-[60%]'>
          <div className=' w-full flex items-center gap-3'>
            <p className=' text-[1.2rem]'>Name: {data?.campaignName}</p>
          </div>
          <div className=' w-full flex items-center gap-3'>
            <p className=' text-[1.2rem]'>Budget: {data?.campaignBudget}</p>
          </div>
          <div className=' w-full flex items-center gap-3'>
            <p className=' text-[1.2rem]'>Status: {data?.campaignState}</p>
          </div>
        </div>
        <div>
          <Button
            fullWidth
            variant='contained'
            type='submit'
            onClick={() => {
              setOpenCreateScedule(true)
              setSingleSceduleData(data)
            }}
          >
            <Plus /> Add Schedule
          </Button>
        </div>
      </div>
      <div className=' w-full '>
        <SadowlessTable
          headers={headers}
          selectionId='SceduleData.id'
          csv={false}
          data={SceduleData}
          action={false}
          number={SceduleData?.meta?.totalRecords}
          page={page}
          setPage={setPage}
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          loading={false}
          setLoading={() => {}}
          actionElements={actionElements}
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
        />
      </div>

      <DialogComponent
        open={openCreateScedule}
        handleClose={() => setOpenCreateScedule(false)}
        data={singleSceduleData}
        title='Create Schedule'
        maxWidth='xl'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <div className=' max-w-[100%]'>
            <CreateCampaginSchedule data={[data]} handleClose={handleClose} />
          </div>
        )}
      </DialogComponent>

      {/* </div> */}
    </>
  )
}

export default SceduleTable

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
