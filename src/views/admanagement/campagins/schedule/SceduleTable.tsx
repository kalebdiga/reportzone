'use client'
import React, { useState } from 'react'

import { Button, Chip, IconButton, ListItemIcon, ListItemText, Switch, Typography } from '@mui/material'
import { ArrowLeft, Check, Copy, LockKeyhole, Pencil, Plus, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import { date } from 'yup'
import { convertToDateOnly, formatDateToDayAndTime, formatDayTime, formatDayTimeNewYork } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'
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
import { MenuItem } from '@/components/Menu'
import UpdateCampaginSchedule from './UpdateCampaginSchedule'
import Delete from './Delete'
import ChangeStatus from './ChangeStatus'

const handleCopy = (text: string) => {
  copy(text)
  toast.success('Email Copied to Clipboard')
}
const SceduleTable = ({ data, handleClose }: { data?: any; handleClose?: () => void }) => {
  const id = data?.id
  console.log(typeof data, 'data of add profile')

  console.log(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [openCreateScedule, setOpenCreateScedule] = useState(false)
  const [singleSceduleData, setSingleSceduleData] = useState<UserData>(null as any)

  const [openUpdateScedule, setOpenUpdateScedule] = useState(false)

  const { companyUsers } = useUserStore()
  const session = useSession()
  const [singleData, setSingleData] = useState()
  const { data: SceduleData, isLoading } = useFetchData(
    ['updateScedule', session?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/schedules?campaignId=${id}`
  )

  const headers = [
    {
      key: 'createdAt',
      label: 'Schedule',
      render: (row: any) => formatDayTimeNewYork(row)
    },
    {
      key: 'state',
      label: 'State',
      render: (row: any) => (
        <Chip
          label={row.state ?? 'No change'}
          color={row.state === 'ENABLED' ? 'success' : row.state === 'PAUSED' ? 'warning' : 'primary'}
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
    { key: 'active', label: 'Status', render: (row: any) => <ChangeStatus row={row} /> }
  ]

  const handleActionClick = (row: any) => {
    setSingleSceduleData(row)
    setOpenEmplyeeProfile(true)
  }
  const actionElements = (row: any) => (
    <div>
      {/* <div className=' flex flex-col gap-2 p-[1%] z-[999]'> */}
      <MenuItem
        onClick={() => {
          //  setOpenCampaginHistory(true)
          setOpenUpdateScedule(true)
          setSingleData(row)
        }}
      >
        <ListItemIcon>
          <i className='tabler-pencil text-xl' />
        </ListItemIcon>
        <ListItemText primary='Edit' />
      </MenuItem>
      <Delete id={row} />

      {/* </div> */}
    </div>
  )

  return (
    <>
      <div className=' flex justify-between items-center mb-[0%] w-full '>
        <div className=' w-[50%] max-md:w-[100%]'>
          <div className=' w-full flex items-center gap-3'>
            <p className=' text-[1.2rem] max-md:text-[0.7rem]'>Name: {data?.campaignName}</p>
          </div>
          <div className=' w-full flex items-center gap-3'>
            <p className=' text-[1.2rem] max-md:text-[0.7rem]'>Budget: {data?.campaignBudget}</p>
          </div>
          <div className=' w-full flex items-center gap-3'>
            <p className=' text-[1.2rem] max-md:text-[0.7rem]'>
              Status:{' '}
              <Chip
                label={data.campaignState}
                color={data.campaignState === 'ENABLED' ? 'success' : 'warning'}
                variant='tonal'
              />
            </p>
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
            className=' max-md:text-[0.7rem]'
          >
            <Plus /> <span className=' hidden md:block'> Add Schedule</span>
          </Button>
        </div>
      </div>
      <SadowlessTable
        headers={headers}
        selectionId='SceduleData.id'
        csv={false}
        data={SceduleData ?? []}
        action={true}
        number={SceduleData?.meta?.totalRecords}
        page={page}
        setPage={setPage}
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        loading={isLoading}
        setLoading={() => {}}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        actionElementsNotDrop={row => {
          return (
            <>
              <Delete id={row} />

              <MenuItem
                onClick={() => {
                  //  setOpenCampaginHistory(true)
                  setOpenUpdateScedule(true)
                  setSingleData(row)
                }}
              >
                <ListItemIcon>
                  <i className='tabler-pencil text-xl' />
                </ListItemIcon>
              </MenuItem>
            </>
          )
        }}
      />

      <DialogComponent
        open={openCreateScedule}
        handleClose={() => setOpenCreateScedule(false)}
        data={singleSceduleData}
        title='Create Schedule'
        maxWidth='md'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <>
            <CreateCampaginSchedule data={[data]} handleClose={handleClose} />
          </>
        )}
      </DialogComponent>

      <DialogComponent
        open={openUpdateScedule}
        handleClose={() => setOpenUpdateScedule(false)}
        data={singleData}
        title='Update Schedule'
        maxWidth='md'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateCampaginSchedule data={[data]} handleClose={handleClose} />
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
