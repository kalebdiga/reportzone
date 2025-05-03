'use client'
import React, { useState } from 'react'

import { Button, Switch } from '@mui/material'
import { Check, Plus, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'

const EmployeesTable = () => {
  const data = useSession()
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const { companyUsers } = useUserStore()

  const headers = [
    { key: 'name', label: 'First Name' },
    { key: 'user.email', label: 'Email' },
    // { key: 'user.accountStatus', label: 'Account Status' },
    { key: 'user.emailVerified', label: 'Verified', render: (row: any) => <StatusAction2 row={row} /> },
    { key: 'role', label: 'Role' },
    // { key: 'companyUsers[0].role', label: 'Company Role' },
    // { key: 'companyUsers[0].isActive', label: 'Company Active' },
    {
      key: 'user.accountStatus',
      label: 'Status',
      render: (row: any) => <StatusAction row={row} />
    }
  ]

  const { data: EmployeeData, isLoading } = useFetchData(
    ['profile', data?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/users?page_size=${resultsPerPage}&page=${page}&company_id=${companyUsers[0]?.companyId}`,
    data?.data?.user?.accessToken ? { Authorization: `Bearer ${data?.data?.user?.accessToken}` } : {}
  )

  const transformedData = (EmployeeData?.users || [])?.map((item: any) => ({
    ...item,
    name: item.user.fname + ' ' + item.user.lname,
    role: item.user.globalRole ? 'Super Admin' : ''
  }))

  const handleActionClick = (row: any) => {
    alert(`Action clicked for ${row.name}`)
  }

  const actionElements = (row: any) => (
    <div className=' flex flex-col gap-2 p-[1%] z-[999]'>
      <Button variant='outlined' onClick={() => handleActionClick(row)}>
        Edit
      </Button>
      <Button variant='tonal' color='warning' onClick={() => alert(`Delete ${row.name}`)}>
        Delete
      </Button>
    </div>
  )

  return (
    <Table
      headers={headers}
      selectionId='user.id'
      csv={true}
      data={transformedData}
      action={true}
      addNew={
        <Button variant='contained'>
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
  )
}

export default EmployeesTable

const StatusAction = ({ row }: any) => {
  const [status, setStatus] = useState(row.status)

  const handleStatusChange = () => {
    const newStatus = status === 'Active' ? 'Inactive' : 'Active'
    setStatus(newStatus)
    alert(`Status changed to ${newStatus} for ${row.name}`)
  }

  return (
    <button
      onClick={handleStatusChange}
      style={{ color: status === 'Active' ? 'green' : 'red' }}
      className=' bg-transparent'
    >
      {/* <div>{status}</div> */}

      <div>
        <Switch checked={status === 'Active'} onChange={handleStatusChange} color='primary' />
      </div>
    </button>
  )
}

const StatusAction2 = ({ row }: any) => {
  const [status, setStatus] = useState(row.status)

  const handleStatusChange = () => {
    const newStatus = status === 'Active' ? 'Inactive' : 'Active'
    setStatus(newStatus)
    alert(`Status changed to ${newStatus} for ${row.name}`)
  }
  console.log(row?.user?.emailVerified, 'row')

  return (
    <button
      onClick={handleStatusChange}
      style={{ color: !row?.user?.emailVerified ? 'rgb(27, 94, 32)' : 'rgb(183, 28, 28)' }}
      className=' bg-transparent '
    >
      <div>{row?.user?.emailVerified ? <Check className='size-[1rem]' /> : <X className='size-[1rem]' />}</div>
    </button>
  )
}
