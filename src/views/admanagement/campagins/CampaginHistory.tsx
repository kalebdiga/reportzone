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
import { type UserData } from '@/typs/user.type'
import Link from 'next/link'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import SadowlessTable from '@/components/layout/shared/table/SadowlessTable'

const handleCopy = (text: string) => {
  copy(text)

  // toast.success('Email Copied to Clipboard')
}

const mockdata = [
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
    type: 'Campaign',
    name: 'Holiday Promo',
    action: 'update',
    oldValue: 'Budget: 2000',
    newValue: 'Budget: 2500',
    description: 'Increased budget',
    changeMadeBy: 'Lemi',
    createdAt: '2024-10-05',
    updatedAt: '2024-10-06'
  }
]

const headers = [
  { label: 'Created At', key: 'createdAt' },
  { label: 'Action', key: 'action' },
  { label: 'Name', key: 'name' },
  { label: 'Old Value', key: 'oldValue' },
  { label: 'New Value', key: 'newValue' },
  { label: 'Changed By', key: 'changeMadeBy' }
]

const CampaginHistory = ({ data, handleClose }: { data?: any; handleClose?: () => void }) => {
  const id = data?.id

  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleProductData, setSingleProductData] = useState<UserData>(null as any)

  //hooks

  const { companyUsers } = useUserStore()
  const session = useSession()

  const { data: ProductData, isLoading } = useFetchData(
    ['products', session?.data?.user?.accessToken, companyUsers[0]?.companyId, page, resultsPerPage],
    `/advertising/campaigns/${id}/products`
  )
  const handleActionClick = (row: any) => {
    setSingleProductData(row)
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
          setOpenEmplyeePassword(true), setSingleProductData(row)
        }}
      >
        <div className='flex items-center gap-2 '>
          <LockKeyhole className='size-[1rem]' />
          <span>Change Password</span>
        </div>
      </Button>
    </div>
  )

  return (
    <>
      <div className=' w-full '>
        <SadowlessTable
          headers={headers}
          selectionId='user.id'
          csv={false}
          data={mockdata}
          action={false}
          number={ProductData?.meta?.totalRecords}
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
      </div>

      {/* </div> */}
    </>
  )
}

export default CampaginHistory

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
