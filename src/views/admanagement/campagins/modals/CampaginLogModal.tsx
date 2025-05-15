import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import CampaginsLogsTable from '../tables/CampaginsLogsTable'
export let lol: any
function CampaginLogModal(data: any) {
  const [openModal, setOpenModal] = useState(false)

  lol = {
    text: 'Logs',
    icon: 'tabler-report',
    menuItemProps: {
      onClick: () => {
        setOpenModal(true)
      }
    }
  }
  return (
    <>
      <IconButton
        onClick={() => {
          setOpenModal(true)
        }}
      >
        <i className='tabler-report text-textSecondary' />
      </IconButton>

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={data}
        maxWidth='lg'
        title={`Logs Of ${data?.data?.original?.campaignName}`}
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => <CampaginsLogsTable data={data} />}
      </DialogComponent>
    </>
  )
}

export default CampaginLogModal
