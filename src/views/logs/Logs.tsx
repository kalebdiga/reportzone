'use client'
import Table from '@/components/layout/shared/table/Table'
import { Button } from '@mui/material'
import React, { useState } from 'react'
const data = [
  {
    id: '1',
    type: 'Campaign',
    name: 'Holiday Promo',
    action: 'insert',
    oldValue: '',
    newValue: 'Budget: 2000',
    description: 'Initial creation of campaign',
    changeMadeBy: 'Lemi',
    createdAt: '2024-10-01',
    updatedAt: '2024-10-01'
  },
  {
    id: '2',
    type: 'User',
    name: 'John Doe',
    action: 'update',
    oldValue: 'Role: user',
    newValue: 'Role: admin',
    description: 'Promoted user to admin',
    changeMadeBy: 'Lemi',
    createdAt: '2024-10-05',
    updatedAt: '2024-10-06'
  },
  {
    id: '3',
    type: 'Order',
    name: 'Order #1234',
    action: 'delete',
    oldValue: 'Status: pending',
    newValue: '',
    description: 'Cancelled order',
    changeMadeBy: 'Per',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-01'
  },
  {
    id: '4',
    type: 'Product',
    name: 'Laptop',
    action: 'insert',
    oldValue: '',
    newValue: 'Price: 1500',
    description: 'Added new product',
    changeMadeBy: 'Anna',
    createdAt: '2024-08-15',
    updatedAt: '2024-08-15'
  },
  {
    id: '5',
    type: 'Campaign',
    name: 'Summer Sale',
    action: 'update',
    oldValue: 'Discount: 10%',
    newValue: 'Discount: 15%',
    description: 'Updated campaign discount',
    changeMadeBy: 'Lemi',
    createdAt: '2024-07-20',
    updatedAt: '2024-07-21'
  },
  {
    id: '6',
    type: 'User',
    name: 'Jane Smith',
    action: 'delete',
    oldValue: 'Role: admin',
    newValue: '',
    description: 'Removed user from the system',
    changeMadeBy: 'Per',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-10'
  },
  {
    id: '7',
    type: 'Order',
    name: 'Order #5678',
    action: 'insert',
    oldValue: '',
    newValue: 'Status: pending',
    description: 'Created new order',
    changeMadeBy: 'Anna',
    createdAt: '2024-05-05',
    updatedAt: '2024-05-05'
  },
  {
    id: '8',
    type: 'Product',
    name: 'Smartphone',
    action: 'update',
    oldValue: 'Price: 800',
    newValue: 'Price: 750',
    description: 'Reduced product price',
    changeMadeBy: 'Lemi',
    createdAt: '2024-04-15',
    updatedAt: '2024-04-16'
  },
  {
    id: '9',
    type: 'Campaign',
    name: 'Black Friday',
    action: 'insert',
    oldValue: '',
    newValue: 'Budget: 5000',
    description: 'Created Black Friday campaign',
    changeMadeBy: 'Per',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01'
  },
  {
    id: '10',
    type: 'User',
    name: 'Michael Brown',
    action: 'update',
    oldValue: 'Role: employee',
    newValue: 'Role: manager',
    description: 'Promoted user to manager',
    changeMadeBy: 'Anna',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-11'
  }
]
const headers = [
  { label: 'Name', key: 'name' },

  { label: 'Type', key: 'type' },
  { label: 'Action', key: 'action', render: (row: any) => <StatusAction row={row} /> },

  { label: 'Old Value', key: 'oldValue' },
  { label: 'New Value', key: 'newValue' },
  { label: 'Changed By', key: 'changeMadeBy' },
  { label: 'Updated At', key: 'createdAt' }
]
function Logs() {
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)

  return (
    <Table
      headers={headers}
      csv={true}
      data={data}
      action={false}
      addNew={<></>}
      tableTitle='Logs'
      number={data.length}
      page={page}
      setPage={setPage}
      resultsPerPage={resultsPerPage}
      setResultsPerPage={setResultsPerPage}
      loading={false}
      setLoading={() => {}}
      dropdownVisible={dropdownVisible}
      setDropdownVisible={setDropdownVisible}
    />
  )
}

export default Logs

const StatusAction = ({ row }: any) => {
  return (
    <span
      className={`${row.action === 'insert' ? 'text-green-500' : row.action === 'update' ? ' text-yellow-500' : 'text-red-500'}`}
    >
      {row.action}
    </span>
  )
}
