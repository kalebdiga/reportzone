import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import UpdateCampaginSchedule from '../UpdateCampaginSchedule'
import { type CampaignSchedule } from '@/typs/campagin.type'
function UpdateCampaginScheduleModal(data: any) {
  const [openModal, setOpenModal] = useState(false)
  return (
    <div>
      <IconButton
        onClick={() => {
          //  setOpenCampaginHistory(true)
          setOpenModal(true)
        }}
      >
        <i className='tabler-edit text-textSecondary' />
      </IconButton>

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={data?.data?.original}
        title='Update Schedule'
        maxWidth='md'
      >
        {({ data, handleClose }: { data: CampaignSchedule; handleClose?: () => void }) => (
          <UpdateCampaginSchedule data={[data]} handleClose={handleClose} />
        )}
      </DialogComponent>
    </div>
  )
}

export default UpdateCampaginScheduleModal
