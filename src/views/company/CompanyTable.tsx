'use client'
import React, { useState } from 'react'

import { Button, ListItemIcon, ListItemText } from '@mui/material'
import { Pencil, Plus } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import ChangeStatus from './ChangeStatus'
import { convertToDateOnly } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'

import { type UserData } from '@/typs/user.type'

import CreateCompany from './CreateCompany'
import UpdateCompany from './UpdateCompany'
import CompanyEmployeesTable from './employee/CompanyEmployeesTable'
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { MenuItem } from '@/components/Menu'

const CompanyTable = () => {
  //state
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyee, setOpenEmplyee] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleCompanyData, setSingleCompanyData] = useState<any>(null as any)

  //hooks

  const data = useSession()

  const headers = [
    { key: 'name', label: 'Company Name' },
    {
      key: 'totalEmployee',
      label: 'Total Employees',
      render: (row: any) => (
        <div
          onClick={() => {
            setOpenEmplyee(true)
            setSingleCompanyData(row)
          }}
        >
          <span className={` cursor-pointer ${row?.totalEmployee > 0 ? ' text-blue-600' : 'text-blue-600'}`}>
            {' '}
            {row?.totalEmployee}
          </span>
        </div>
      )
    },

    { key: 'status', label: 'Status', render: (row: any) => <ChangeStatus row={row} /> },
    { key: 'createdAt', label: 'Created At', render: (row: any) => convertToDateOnly(row.createdAt) },
    { key: 'updatedAt', label: 'Updated At', render: (row: any) => convertToDateOnly(row.updatedAt) }
  ]
  const { data: CompanyData, isLoading } = useFetchData(
    ['companyData', data?.data?.user?.accessToken, page, resultsPerPage],
    `/companies?page_size=${resultsPerPage}&page=${page}`
  )

  const handleActionClick = (row: any) => {
    setSingleCompanyData(row)
    setOpenEmplyeeProfile(true)
  }
  const actionElements = (row: any) => (
    <div>
      <MenuItem onClick={() => handleActionClick(row)}>
        <ListItemIcon>
          <i className='tabler-pencil text-xl' />
        </ListItemIcon>
        <ListItemText primary='Edit' />
      </MenuItem>
    </div>
  )

  return (
    <>
      <Table
        headers={headers}
        selectionId='user.id'
        csv={true}
        data={CompanyData?.companies}
        csvName='Company'
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
        tableTitle='Companies'
        number={CompanyData?.meta?.totalRecords}
        page={page}
        setPage={setPage}
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        loading={isLoading}
        setLoading={() => {}}
        actionElements={actionElements}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />
      <DialogComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={singleCompanyData}
        title='Update Company'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <UpdateCompany data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
      <DialogComponent
        maxWidth='lg'
        open={OpenEmplyee}
        handleClose={() => setOpenEmplyee(false)}
        data={singleCompanyData}
        title={`${singleCompanyData?.name}/Employees`}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CompanyEmployeesTable handleClose={handleClose} data={data} />
        )}
      </DialogComponent>
      <DialogComponent
        open={openCreateEployee}
        handleClose={() => setOpenCreateEployee(false)}
        maxWidth='sm'
        title='Create Company'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateCompany handleClose={handleClose} id={data} />
        )}
      </DialogComponent>
    </>
  )
}

export default CompanyTable
