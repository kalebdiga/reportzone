'use client'
import React, { useState } from 'react'

import { Button } from '@mui/material'
import { Pencil, Plus } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import ChangeStatus from './ChangeStatus'
import { convertToDateOnly } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'
import ModalComponent from '@/components/layout/shared/ModalComponent'

import { type UserData } from '@/typs/user.type'

import CreateCompany from './CreateCompany'
import UpdateCompany from './UpdateCompany'
import CompanyEmployeesTable from './employee/CompanyEmployeesTable'

const CompanyTable = () => {
  //state
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
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
          <span className={`${row?.totalEmployee > 0 ? ' text-blue-600' : 'text-blue-600'}`}>
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
    return <TableSkeleton />
  }
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
        loading={false}
        setLoading={() => {}}
        actionElements={actionElements}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />
      <ModalComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={singleCompanyData}
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <UpdateCompany data={data} handleClose={handleClose} />
        )}
      </ModalComponent>
      <ModalComponent open={OpenEmplyee} handleClose={() => setOpenEmplyee(false)} data={singleCompanyData}>
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CompanyEmployeesTable handleClose={handleClose} data={data} />
        )}
      </ModalComponent>
      <ModalComponent open={openCreateEployee} handleClose={() => setOpenCreateEployee(false)}>
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateCompany handleClose={handleClose} id={data} />
        )}
      </ModalComponent>
    </>
  )
}

export default CompanyTable
