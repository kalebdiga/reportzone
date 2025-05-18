import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import CampaginsLogsTable from '../tables/CampaginsLogsTable'
import ProductsTable from './ProductsTable'
function CampaginProductModal(data: any) {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <Typography
        onClick={() => {
          setOpenModal(true)
        }}
        className=' text-blue-900 cursor-pointer'
      >
        {data?.data?.original?.totalProducts}
      </Typography>

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={data}
        maxWidth='md'
        title={`Products of ${data?.data?.original?.campaignName}`}
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <ProductsTable data={data?.data?.original} />
        )}
      </DialogComponent>
    </>
  )
}

export default CampaginProductModal
