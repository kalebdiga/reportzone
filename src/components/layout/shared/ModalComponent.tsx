import { IconButton } from '@mui/material'
import Modal from '@mui/material/Modal'
import { X } from 'lucide-react'
import { type ReactNode } from 'react'

interface ModalComponentProps {
  open: boolean
  handleClose: () => void
  children: (props: { data: any; handleClose: () => void }) => ReactNode
  data?: any
}

const ModalComponent: React.FC<ModalComponentProps> = ({ open, handleClose, children, data }) => {
  return (
    <Modal
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      open={open}
      onClose={handleClose}
      className='fixed inset-0 flex items-center justify-center'
    >
      <div className='flex relative  bg-red-500'>
        {handleClose && (
          <div className='absolute top-2 right-2'>
            <IconButton onClick={handleClose} aria-label='Close'>
              <X size={20} />
            </IconButton>
          </div>
        )}
        <div className='bg-white  rounded shadow-md'>{children({ data, handleClose })}</div>
      </div>
    </Modal>
  )
}

export default ModalComponent
