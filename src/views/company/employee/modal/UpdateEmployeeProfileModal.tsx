import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import UpdateEmployeeProfile from '../forms/UpdateEmployeeProfile'
function UpdateEmployeeProfileModal(data: any) {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <IconButton
        onClick={() => {
          setOpenModal(true)
        }}
      >
        <i className='tabler-edit text-textSecondary' />
      </IconButton>

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={data}
        title='Update Employee Profile
'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <UpdateEmployeeProfile data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
    </>
  )
}

export default UpdateEmployeeProfileModal
