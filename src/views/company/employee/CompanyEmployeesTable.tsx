'use client'
import React, { useState } from 'react'

import { Button, IconButton, Switch, Typography } from '@mui/material'
import { ArrowLeft, Check, Copy, LockKeyhole, Pencil, Plus, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import { date } from 'yup'
import { convertToDateOnly } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'
import ModalComponent from '@/components/layout/shared/ModalComponent'
import UpdateEmployeeProfile from './UpdateEmployeeProfile'
import UpdateEmployeePassword from './UpdateEmployeePassword'
import { type UserData } from '@/typs/user.type'
import CreateEmployee from './CreateEmployee'
import ChangeEployeeStatus from '../../employees/ChangeEployeeStatus'
import Link from 'next/link'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

const handleCopy = (text: string) => {
  copy(text)
  toast.success('Email Copied to Clipboard')
}
const CompanyEmployeesTable = ({ id }: { id: string }) => {
  //state

  console.log(id, 'from employee table')
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
    {
      key: 'user.email',
      label: 'Email',
      render: (row: any) => (
        <div className='flex items-center gap-2 group'>
          <span className='group-hover:underline'>{row?.user?.email}</span>
          <Copy
            className='opacity-0 group-hover:opacity-100 cursor-pointer size-[0.8rem] '
            onClick={() => handleCopy(row?.user?.email)}
          />
        </div>
      )
    },
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
    ['CompanyEmployees', data?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/users?page_size=${resultsPerPage}&page=${page}&company_id=${id}`
  )
  const { data: Company } = useFetchData([], `/companies/${id}`)
  console.log(Company, 'company')

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
      <div className='w-[100%] bg-backgroundPaper text-textPrimary  mt-[2%] '>
        <div className='w-[100%] flex items-center justify-start pt-[2%]   gap-[12px]'>
          <Link href={'/companies'}>
            <div className=' border-[1px] border-textPrimary rounded-[8px] h-[32px] w-[32px] flex justify-center items-center   '>
              <ArrowLeft />
            </div>{' '}
          </Link>

          <Typography variant='h1' className=' hidden md:block text-[1.1rem]'>
            Back
          </Typography>
        </div>
      </div>

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
        tableTitle={`${Company?.name}/Employees`}
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
      <ModalComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={singleEmployeeData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateEmployeeProfile data={data} handleClose={handleClose} />
        )}
      </ModalComponent>
      <ModalComponent
        open={OpenEmplyeePassword}
        handleClose={() => setOpenEmplyeePassword(false)}
        data={singleEmployeeData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateEmployeePassword data={data} handleClose={handleClose} />
        )}
      </ModalComponent>
      <ModalComponent open={openCreateEployee} handleClose={() => setOpenCreateEployee(false)} data={id}>
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateEmployee handleClose={handleClose} id={data} />
        )}
      </ModalComponent>
    </>
  )
}

export default CompanyEmployeesTable

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
