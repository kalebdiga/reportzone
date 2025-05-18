import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import UpdateEmployeePassword from '../forms/UpdateEmployeePassword'
function UpdateEmployeePasswordModal(data: any) {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <IconButton
        onClick={() => {
          setOpenModal(true)
        }}
      >
        <i className='tabler-trash text-textSecondary' />
      </IconButton>

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={data}
        title='Change Password
'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <UpdateEmployeePassword data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
    </>
  )
}

export default UpdateEmployeePasswordModal
