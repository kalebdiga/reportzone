'use client'
import React, { useState } from 'react'

import { Button, Switch } from '@mui/material'
import { Check, LockKeyhole, Pencil, Plus, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import ChangeEployeeStatus from './ChangeEployeeStatus'
import { date } from 'yup'
import { convertToDateOnly } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'
import ModalComponent from '@/components/layout/shared/ModalComponent'
import UpdateEmployeeProfile from './UpdateEmployeeProfile'
import UpdateEmployeePassword from './UpdateEmployeePassword'
import { type UserData } from '@/typs/user.type'
import CreateEmployee from './CreateEmployee'
import Card from '@mui/material/Card'
import DialogComponent from '@/components/layout/shared/DialogsSizes'

const EmployeesTable = () => {
  //state
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleEmployeeData, setSingleEmployeeData] = useState<UserData>(null as any)

  //hooks

  const { companyUsers } = useUserStore()
  const data = useSession()

  const headers = [
    { key: 'name', label: 'First Name' },
    { key: 'user.email', label: 'Email' },
    { key: 'user.emailVerified', label: 'Verified', render: (row: any) => <VerifiedRenderHandeler row={row} /> },
    { key: 'role', label: 'Role' },

    {
      key: 'user.accountStatus',
      label: 'Status',
      render: (row: any) => <ChangeEployeeStatus row={row} />
    },
    { key: 'date', label: 'Date' }
  ]

  const { data: EmployeeData, isLoading } = useFetchData(
    ['employeeData', data?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/users?page_size=${resultsPerPage}&page=${page}&company_id=${companyUsers[0]?.companyId}`,
    data?.data?.user?.accessToken ? { Authorization: `Bearer ${data?.data?.user?.accessToken}` } : {}
  )

  const { data: EmployeeDataForCsv } = useFetchData(
    ['employeeData', data?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/users?page_size=${resultsPerPage}&page=${page}&company_id=${companyUsers[0]?.companyId}`,
    data?.data?.user?.accessToken ? { Authorization: `Bearer ${data?.data?.user?.accessToken}` } : {}
  )

  // const { data: EmployeeData, isLoading } = useFetchData(
  //   ['employeeData', data?.data?.user?.accessToken, companyUsers[0]?.companyId],
  //   `/users?company_id=${companyUsers[0]?.companyId}`,
  //   data?.data?.user?.accessToken ? { Authorization: `Bearer ${data?.data?.user?.accessToken}` } : {}
  // )
  const transformedData = (EmployeeData?.users || [])?.map((item: any) => ({
    ...item,
    name: item.user.fname + ' ' + item.user.lname,
    role: item.user.globalRole ? 'Super Admin' : item.companyUsers[0]?.role,
    date: convertToDateOnly(item.user.createdAt)
  }))

  // // Filter, sort, and paginate data
  // const transformedData = (EmployeeData?.users || [])
  //   .sort((a: any, b: any) => {
  //     // Custom sorting logic: prioritize 'active' over 'suspended'
  //     const statusOrder = { active: 1, suspended: 2 }
  //     return (
  //       (statusOrder[a.user.accountStatus as keyof typeof statusOrder] || 5) -
  //       (statusOrder[b.user.accountStatus as keyof typeof statusOrder] || 5)
  //     )
  //   })
  //   .map((item: any) => ({
  //     ...item,
  //     name: item.user.fname + ' ' + item.user.lname,
  //     role: item.user.globalRole ? 'Super Admin' : '',
  //     date: convertToDateOnly(item.user.createdAt)
  //   }))
  //   .slice((page - 1) * resultsPerPage, page * resultsPerPage) // Paginate data
  const handleActionClick = (row: any) => {
    setSingleEmployeeData(row)
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
      <Button
        variant='tonal'
        color='warning'
        onClick={() => {
          setOpenEmplyeePassword(true), setSingleEmployeeData(row)
        }}
      >
        <div className='flex items-center gap-2 '>
          <LockKeyhole className='size-[1rem]' />
          <span>Change Password</span>
        </div>
      </Button>
    </div>
  )
  if (isLoading) {
    return <TableSkeleton />
  }
  return (
    <>
      <Table
        headers={headers}
        selectionId='user.id'
        csv={true}
        data={transformedData}
        action={true}
        addNew={
          <Button
            variant='contained'
            onClick={() => {
              setOpenCreateEployee(true)
            }}
          >
            <Plus />
            <span className=' max-md:hidden'>Add New</span>
          </Button>
        }
        tableTitle='
Employees'
        number={EmployeeData?.meta?.totalRecords}
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
      <DialogComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={singleEmployeeData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateEmployeeProfile data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent
        open={OpenEmplyeePassword}
        handleClose={() => setOpenEmplyeePassword(false)}
        data={singleEmployeeData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateEmployeePassword data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent open={openCreateEployee} handleClose={() => setOpenCreateEployee(false)}>
        {({ handleClose }) => <CreateEmployee handleClose={handleClose} />}
      </DialogComponent>
    </>
  )
}

export default EmployeesTable

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
