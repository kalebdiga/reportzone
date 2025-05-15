'use client'
import React, { useState } from 'react'

import { Button, Chip } from '@mui/material'
import { Check, LockKeyhole, Pencil, X } from 'lucide-react'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useSession } from 'next-auth/react'

import TableSkeleton from '@/utils/TableSkleton'
import { type UserData } from '@/typs/user.type'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import Table2 from '@/components/layout/shared/table/SadowlessTable'
import SadowlessTable from '@/components/layout/shared/table/SadowlessTable'
import ProductImaage from './../../../../../public/images/product.jpg'
import Image from 'next/image'

const handleCopy = (text: string) => {
  copy(text)
}
const ProductTable = ({ data, handleClose }: { data?: any; handleClose?: () => void }) => {
  const id = data?.id
  console.log(data, 'data of add profile')

  console.log(id, 'from employee table')
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)
  const [singleProductData, setSingleProductData] = useState<UserData>(null as any)

  //hooks

  const { companyUsers } = useUserStore()
  const session = useSession()

  const headers = [
    {
      key: 'img',
      label: 'Product Image',
      render: (row: any) => (
        <span
          style={{
            color: row.state === 'PAUSED' ? '#a16207' : row.campaignState === 'ARCHIVED' ? '#7f1d1d' : '#14532d'
          }}
        >
          <Image src={ProductImaage} alt='product image' width={45} height={45} />
        </span>
      )
    },

    { key: 'AdProduct', label: 'Product Name', render: (row: any) => <span>Product Name</span> },

    { key: 'sku', label: 'SKU' },
    { key: 'asin', label: 'ASIN' },

    {
      key: 'state',
      label: 'State',
      render: (row: any) => (
        <Chip
          label={row.state ?? 'No change'}
          color={row.state === 'ENABLED' ? 'success' : row.state === 'PAUSED' ? 'warning' : 'error'}
          variant='tonal'
        />
      )
    }
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

  return (
    <>
      <div className=' w-full '>
        <SadowlessTable
          headers={headers}
          selectionId='user.id'
          csv={false}
          data={ProductData?.products}
          action={false}
          number={ProductData?.meta?.totalRecords}
          page={page}
          setPage={setPage}
          resultsPerPage={resultsPerPage}
          isPagination={isLoading}
          setResultsPerPage={setResultsPerPage}
          loading={isLoading}
          setLoading={() => {}}
          actionElements={actionElements}
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
        />
      </div>
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
