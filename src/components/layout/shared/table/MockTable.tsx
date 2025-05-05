'use client'
import React, { useState } from 'react'
import Table from './Table'
import { Button, Switch } from '@mui/material'
import { Plus } from 'lucide-react'

const MockTable = () => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', render: (row: unknown) => <StatusAction row={row} /> }
  ]

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Editor', status: 'Active' },
    { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', role: 'Viewer', status: 'Pending' }
  ]
  const [sendDrawerOpen, setSendDrawerOpen] = useState(false)

  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)

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
    <>
      <Table
        headers={headers}
        csv={true}
        data={mockData}
        action={true}
        addNew={
          <Button variant='contained' onClick={() => setSendDrawerOpen(true)}>
            <Plus />
            <span className=' max-md:hidden'>Add New</span>
          </Button>
        }
        tableTitle='Mock Table'
        number={mockData.length}
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
    </>
  )
}

export default MockTable

const ParentComponent = () => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (row: unknown) => <StatusAction row={row} /> }
  ]

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Inactive' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', status: 'Pending' }
  ]

  return (
    <Table
      headers={headers}
      data={mockData}
      action={false}
      tableTitle='User Table'
      number={mockData.length}
      page={1}
      setPage={() => {}}
      resultsPerPage={5}
      setResultsPerPage={() => {}}
      loading={false}
      setLoading={() => {}}
      dropdownVisible={null}
      setDropdownVisible={() => {}}
    />
  )
}

const StatusAction = ({ row }: any) => {
  const [status, setStatus] = useState(row.status)

  const handleStatusChange = () => {
    const newStatus = status === 'Active' ? 'Inactive' : 'Active'
    setStatus(newStatus)
  }

  return (
    <button
      onClick={handleStatusChange}
      style={{ color: status === 'Active' ? 'green' : 'red' }}
      className=' bg-transparent'
    >
      <div>
        <Switch checked={status === 'Active'} onChange={handleStatusChange} color='primary' />
      </div>
    </button>
  )
}
