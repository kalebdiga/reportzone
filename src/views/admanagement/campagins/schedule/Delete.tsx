import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { Button, IconButton, ListItemIcon } from '@mui/material'
import { useState } from 'react'
import useDynamicMutation from '@/apihandeler/usePostData'
import { toast } from 'react-toastify'

export default function Delete({ id }: any) {
  const postMutation = useDynamicMutation({ type: 'Json' })
  const [open, setOpen] = useState(false)
  const handleSubmit = async (id: any) => {
    try {
      postMutation.mutate({
        url: `/schedules/${id}`,
        method: 'DELETE',
        body: {},
        invalidateKey: [['capaignData'], ['updateScedule']],

        onSuccess: data => {
          toast.dismiss()

          toast.dismiss()
          setOpen(false)
        }
      })
    } catch (err) {
      console.error('Error updating schedules:', err)
      toast.dismiss()
      toast.error('Failed to update schedules')
    }
  }
  return (
    <div>
      <IconButton
        onClick={() => {
          setOpen(true)
        }}
      >
        <ListItemIcon>
          <i className='tabler-trash text-xl text-red-700 ' />
        </ListItemIcon>
        {/* <ListItemText primary='Delete' className='text-red-900' /> */}
      </IconButton>

      <DialogComponent
        open={open}
        handleClose={() => setOpen(false)}
        data={id}
        maxWidth='sm'
        title=''
        actions={
          <div className='flex gap-4 w-full justify-end items-end'>
            <Button variant='tonal' color='error' onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                handleSubmit(id?.id)
              }}
            >
              Submit
            </Button>
          </div>
        }
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <>
            <h2>Are you sure you want to delete this schedule?</h2>
          </>
        )}
      </DialogComponent>
    </div>
  )
}

// export  function DeleteDialoag({ id }: any) {
//  const [open, setOpen]= useState(false)

//   return (
//     <div>
//       <MenuItem
//         onClick={() => {
//           //  setOpenCampaginHistory(true)
//         }}
//         className=' bg-red-300'
//         style={{
//           color: 'green'
//         }}
//       >
//         <ListItemIcon>
//           <i className='tabler-trash text-xl text-red-900' />
//         </ListItemIcon>
//         <ListItemText primary='Delete' className='text-red-900' />
//       </MenuItem>

//     </div>
//   )
// }
