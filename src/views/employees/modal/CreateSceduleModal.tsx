import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import CreateEmployee from '../forms/CreateEmployee'
function CreateSceduleModal(data: any) {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Button
        variant='contained'
        className='max-sm:is-full is-auto'
        onClick={() => {
          setOpenModal(true)
        }}
        startIcon={<i className='tabler-plus' />}
      >
        <span className=' max-md:hidden'>Add Employee</span>
      </Button>

      <DialogComponent open={openModal} handleClose={() => setOpenModal(false)} maxWidth='md' title='Create Employee'>
        {({ handleClose }) => <CreateEmployee handleClose={handleClose} />}
      </DialogComponent>
    </>
  )
}

export default CreateSceduleModal
