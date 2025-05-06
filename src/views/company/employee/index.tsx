'use client'
import React, { useState, useMemo } from 'react'
import { Button, Typography } from '@mui/material'
import { ArrowLeft, Check, Copy, LockKeyhole, Pencil, Plus, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
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

const CompanyEmployeesTable = ({ data, handleClose }: { data: any; handleClose?: () => void }) => {
  const id = data?.id
  console.log(data)
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [sortKey, setSortKey] = useState('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleEmployeeData, setSingleEmployeeData] = useState<UserData>(null as any)

  const { companyUsers } = useUserStore()
  const { data: session } = useSession()

  const { data: EmployeeData, isLoading } = useFetchData(
    ['CompanyEmployees', session?.user?.accessToken, companyUsers[0]?.companyId],
    `/users?company_id=${id}`
  )

  const { data: Company } = useFetchData([], `/companies/${id}`)

  const transformedData = useMemo(() => {
    return (EmployeeData?.users || []).map((item: any) => ({
      ...item,
      name: `${item.user.fname} ${item.user.lname}`,
      role: item.user.globalRole ? 'Super Admin' : item.companyUsers[0]?.role,
      date: convertToDateOnly(item.user.createdAt)
    }))
  }, [EmployeeData])

  // Define priority for accountStatus sorting
  const statusPriority: Record<string, number> = {
    active: 1,
    pending: 2,
    suspended: 3,
    deactivated: 4,
    undefined: 5
  }

  // Sort by accountStatus first, then by sortKey
  const sortedData = useMemo(() => {
    return [...transformedData].sort((a, b) => {
      const aStatus = a.user?.accountStatus || 'undefined'
      const bStatus = b.user?.accountStatus || 'undefined'

      const aPriority = statusPriority[aStatus] || 5
      const bPriority = statusPriority[bStatus] || 5

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [transformedData, sortKey, sortDirection, EmployeeData])

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, page, resultsPerPage])

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const headers = [
    { key: 'name', label: 'First Name', onClick: () => toggleSort('name') },
    {
      key: 'user.email',
      label: 'Email',
      render: (row: any) => (
        <div className='flex items-center gap-2 group'>
          <span className='group-hover:underline'>{row?.user?.email}</span>
          <Copy
            className='opacity-0 group-hover:opacity-100 cursor-pointer size-[0.8rem]'
            onClick={() => handleCopy(row?.user?.email)}
          />
        </div>
      )
    },
    {
      key: 'user.emailVerified',
      label: 'Verified',
      render: (row: any) => <VerifiedRenderHandeler row={row} />
    },
    { key: 'role', label: 'Role', onClick: () => toggleSort('role') },
    {
      key: 'user.accountStatus',
      label: 'Status',
      render: (row: any) => <ChangeEployeeStatus row={row} />
    },
    { key: 'date', label: 'Date', onClick: () => toggleSort('date') }
  ]

  const handleActionClick = (row: any) => {
    setSingleEmployeeData(row)
    setOpenEmplyeeProfile(true)
  }

  const actionElements = (row: any) => (
    <div className='flex flex-col gap-2 p-[1%] z-[999]'>
      <Button variant='outlined' onClick={() => handleActionClick(row)}>
        <div className='flex items-center gap-2 '>
          <Pencil className='size-[1rem]' />
          <span>Edit</span>
        </div>
      </Button>
      <Button
        variant='tonal'
        color='warning'
        onClick={() => {
          setOpenEmplyeePassword(true)
          setSingleEmployeeData(row)
        }}
      >
        <div className='flex items-center gap-2 '>
          <LockKeyhole className='size-[1rem]' />
          <span>Change Password</span>
        </div>
      </Button>
    </div>
  )

  if (isLoading) return <TableSkeleton />

  return (
    <>
      <div className='w-full bg-backgroundPaper text-textPrimary mt-[2%]'>
        <div className='w-full flex items-center justify-start pt-[2%] gap-[12px]'>
          <Link href={'/companies'}>
            <div className='border border-textPrimary rounded-[8px] h-[32px] w-[32px] flex justify-center items-center'>
              <ArrowLeft />
            </div>
          </Link>
          <Typography variant='h1' className='hidden md:block text-[1.1rem]'>
            Back
          </Typography>
        </div>
      </div>

      <Table
        headers={headers}
        selectionId='user.id'
        csv={true}
        data={paginatedData}
        action={true}
        addNew={
          <Button variant='contained' onClick={() => setOpenCreateEployee(true)}>
            <Plus />
            <span className='max-md:hidden'>Add New</span>
          </Button>
        }
        tableTitle={`Employees of ${Company?.name}`}
        number={sortedData.length}
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
      className='bg-transparent'
    >
      {row?.user?.emailVerified ? <Check className='size-[1rem]' /> : <X className='size-[1rem]' />}
    </button>
  )
}
