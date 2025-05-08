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
import { type UserData } from '@/typs/user.type'
import Link from 'next/link'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

const handleCopy = (text: string) => {
  copy(text)
  toast.success('Email Copied to Clipboard')
}
const ProductTable = ({ data, handleClose }: { data?: any; handleClose?: () => void }) => {
  const id = data?.id
  console.log(data, 'data of add profile')

  console.log(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(5)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [openCreateEployee, setOpenCreateEployee] = useState(false)
  const [singleProductData, setSingleProductData] = useState<UserData>(null as any)

  //hooks

  const { companyUsers } = useUserStore()
  const session = useSession()

  const headers = [
    { key: 'AdProduct', label: 'Ad Product' },

    { key: 'AdType', label: 'Ad Type' },
    { key: 'sku', label: 'SKU' },
    { key: 'asin', label: 'ASIN' },

    {
      key: 'state',
      label: 'State',
      render: (row: any) => (
        <span
          style={{
            color: row.state === 'PAUSED' ? '#a16207' : row.campaignState === 'ARCHIVED' ? '#7f1d1d' : '#14532d'
          }}
        >
          {row.state}
        </span>
      )
    }

    // {
    //   key: 'deliveryReasons',
    //   label: 'Delivery Reasons',
    //   render: (row: any) => (
    //     <ul>
    //       {row.deliveryReasons.map((reason: string, index: number) => (
    //         <li key={index}>{reason}</li>
    //       ))}
    //     </ul>
    //   )
    // },
    // { key: 'creationDateTime', label: 'Created At', render: (row: any) => convertToDateOnly(row.creationDateTime) },
    // {
    //   key: 'lastUpdatedDateTime',
    //   label: 'Last Updated',
    //   render: (row: any) => convertToDateOnly(row.lastUpdatedDateTime)
    // }
  ]
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
  if (isLoading) {
    return (
      <div className=' is-[800px]'>
        <TableSkeleton />
      </div>
    )
  }
  return (
    <>
      {/* <div className='flex relative justify-center flex-col items-center bs-full bg-backgroundPaper !min-is-full  md:!min-is-[unset] md:is-[800px] md:rounded'> */}
      <div className=' w-full '>
        <Table
          headers={headers}
          selectionId='user.id'
          csv={false}
          data={ProductData?.products}
          action={false}
          number={ProductData?.meta?.totalRecords}
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
      </div>

      {/* </div> */}
    </>
  )
}

export default ProductTable

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
