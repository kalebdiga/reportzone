import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import CampaginsLogsTable from '../tables/CampaginsLogsTable'
import CampaginKeyTable from './CampaginKeyTable'
function CampaginKeyModal(data: any) {
  const [openModal, setOpenModal] = useState(false)
  console.log(data, 'looooooooooooorem')
  return (
    <>
      <Typography
        onClick={() => {
          setOpenModal(true)
        }}
        className=' text-blue-900 cursor-pointer'
      >
        {data?.data?.original?.totalKeywords}
      </Typography>

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={data}
        maxWidth='md'
        title={`Keywords of ${data?.data?.original?.campaignName}`}
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => <CampaginKeyTable data={data} />}
      </DialogComponent>
    </>
  )
}

export default CampaginKeyModal
