import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { type UserData } from '@/typs/user.type'
import { Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import CreateEmployee from '../forms/CreateEmployee'
function CreateEmployeeForCompanyModal({ id }: { id: string }) {
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

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={id}
        title='Create Employee'
        maxWidth='md'
      >
        {({ data, handleClose }: { data: UserData; handleClose?: () => void }) => (
          <CreateEmployee handleClose={handleClose} id={data} />
        )}
      </DialogComponent>
    </>
  )
}

export default CreateEmployeeForCompanyModal
