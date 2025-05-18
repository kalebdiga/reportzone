import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import CampaginsLogsTable from '../tables/CampaginsLogsTable'
import CreateCampaginSchedule from '../schedule/CreateCampaginSchedule'
function CreateSceduleModal(data: any) {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <Button
        variant='contained'
        className='max-sm:is-full is-auto'
        startIcon={<i className='tabler-plus' />}
        onClick={() => {
          setOpenModal(true)
        }}
      >
        <span className='max-md:hidden'>Add schedule</span>
      </Button>

      <DialogComponent
        open={openModal}
        handleClose={() => setOpenModal(false)}
        data={data}
        title='Create Schedule'
        maxWidth='md'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <CreateCampaginSchedule data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
    </>
  )
}

export default CreateSceduleModal
