'use client'
import React, { useState } from 'react'
import { US } from 'country-flag-icons/react/3x2'

import { Button, Switch } from '@mui/material'
import { Check, Link, LockKeyhole, Pencil, Plus, X } from 'lucide-react'
import Table from '@/components/layout/shared/table/Table'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'
import ChangeEployeeStatus from './ChangeEployeeStatus'
import { date } from 'yup'
import { convertToDateOnly } from '@/utils/dateConverter'
import TableSkeleton from '@/utils/TableSkleton'
import ModalComponent from '@/components/layout/shared/ModalComponent'
import CampaginTable from '../campagins/CampaginTable'
import UpdateEmployeePassword from './UpdateEmployeePassword'
import { type UserData } from '@/typs/user.type'
import CreateEmployee from './CreateEmployee'
import { Form, Formik } from 'formik'
import FormikTextField from '@/lib/form/FormikInput'
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { useRouter } from 'next/navigation'

const AddProfileTable = () => {
  //state
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleaddProfileData, setSingleaddProfileData] = useState<UserData>(null as any)

  //hooks
  const router = useRouter()

  const { companyUsers } = useUserStore()
  const data = useSession()

  const headers = [
    {
      key: 'accountName',
      label: 'Account Name',
      render: (row: any) => (
        <div
          onClick={() => {
            setOpenEmplyeeProfile(true)
            setSingleaddProfileData(row)
          }}
        >
          <div className=' flex items-center gap-3'>
            {' '}
            {/* <US title='United States' className='...' /> */}
            {/* <img
              className=' size-[32px]'
              alt='United States'
              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${row?.countryCode}.svg`}
            /> */}
            <h1 className=' font-[500] text-[1rem]'> {row?.accountName}</h1>
          </div>
        </div>
      )
    },
    { key: 'countryCode', label: 'Country Code' },

    {
      key: 'totalCampaigns',
      label: 'Campaigns',
      render: (row: any) => (
        <div
          onClick={() => {
            router.push(`campagines?profileId=${row?.id}`)
          }}
        >
          <span className={`${row?.totalCampaigns > 0 ? ' text-blue-600' : 'text-blue-600'}`}>
            {' '}
            {row?.totalCampaigns}
          </span>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (row: any) => (
        <span style={{ color: row.isActive ? 'green' : 'red' }}>{row.isActive ? 'Active' : 'Inactive'}</span>
      )
    },

    // { key: 'accountType', label: 'Account Type' },
    // {
    //   key: 'accountValidPaymentMethod',
    //   label: 'Valid Payment Method',
    //   render: (row: any) => (
    //     <span style={{ color: row.accountValidPaymentMethod ? 'green' : 'red' }}>
    //       {row.accountValidPaymentMethod ? 'Yes' : 'No'}
    //     </span>
    //   )
    // },
    { key: 'createdAt', label: 'Created At', render: (row: any) => convertToDateOnly(row.createdAt) },

    // { key: 'currencyCode', label: 'Currency Code' },
    // { key: 'dailyBudget', label: 'Daily Budget' },

    { key: 'updatedAt', label: 'Updated At', render: (row: any) => convertToDateOnly(row.updatedAt) }
  ]

  const { data: addProfileData, isLoading } = useFetchData(
    ['addProfileData', data?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/advertising/profiles`

    // data?.data?.user?.accessToken ? { Authorization: `Bearer ${data?.data?.user?.accessToken}` } : {}
  )

  console.log(addProfileData, 'adddddddd')

  // const { data: addProfileData, isLoading } = useFetchData(
  //   ['addProfileData', data?.data?.user?.accessToken, companyUsers[0]?.companyId],
  //   `/users?company_id=${companyUsers[0]?.companyId}`,
  //   data?.data?.user?.accessToken ? { Authorization: `Bearer ${data?.data?.user?.accessToken}` } : {}
  // )
  const transformedData = (addProfileData?.users || [])?.map((item: any) => ({
    ...item,
    name: item.user.fname + ' ' + item.user.lname,
    role: item.user.globalRole ? 'Super Admin' : item.companyUsers[0]?.role,
    date: convertToDateOnly(item.user.createdAt)
  }))

  // // Filter, sort, and paginate data
  // const transformedData = (addProfileData?.users || [])
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
    setSingleaddProfileData(row)
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
          setOpenEmplyeePassword(true), setSingleaddProfileData(row)
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
        csv={false}
        data={addProfileData?.profiles}
        action={false}
        addNew={
          <Button
            variant='contained'
            onClick={() => {
              setOpenCreateEployee(true)
            }}
          >
            <Link className=' size-4' />
            <span className=' max-md:hidden'>Link Profile</span>
          </Button>
        }
        tableTitle={<SearchProfile />}
        number={addProfileData?.meta?.totalRecords}
        page={page}
        setPage={setPage}
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        loading={false}
        setLoading={() => {}}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />

      <DialogComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={singleaddProfileData}
        title='Ads Campaigns
'
        maxWidth='xl'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <div className=' max-w-[100%]'>
            <CampaginTable data={data} handleClose={handleClose} />
          </div>
        )}
      </DialogComponent>
      {/* <ModalComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={singleaddProfileData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <div className=' max-w-[800px]'>
            <CampaginTable data={data} handleClose={handleClose} />
          </div>
        )}
      </ModalComponent> */}
      <ModalComponent
        open={OpenEmplyeePassword}
        handleClose={() => setOpenEmplyeePassword(false)}
        data={singleaddProfileData}
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <UpdateEmployeePassword data={data} handleClose={handleClose} />
        )}
      </ModalComponent>
      <ModalComponent open={openCreateEployee} handleClose={() => setOpenCreateEployee(false)}>
        {({ handleClose }) => <CreateEmployee handleClose={handleClose} />}
      </ModalComponent>
    </>
  )
}

export default AddProfileTable

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

const SearchProfile = ({ row }: any) => {
  return (
    <Formik
      initialValues={{
        name: ''
      }}
      onSubmit={() => {}}
    >
      {() => (
        <Form className='space-y-5 w-full pb-1'>
          <div className='flex flex-wrap gap-4'>
            <div className='flex flex-col w-full md:w-[100%]'>
              <FormikTextField name='search' label='search store' placeholder='search...' fullWidth />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
