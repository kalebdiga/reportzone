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
      className='fixed inset-0 flex items-center justify-center '
    >
      <div className='flex  max-h-[90vh] flex-col overflow-y-auto bg-white  '>
        {handleClose && (
          <div className='flex justify-end items-center'>
            <IconButton onClick={handleClose} aria-label='Close'>
              <X size={20} />
            </IconButton>
          </div>
        )}
        <div className='  rounded shadow-md '>{children({ data, handleClose })}</div>
      </div>
    </Modal>
  )
}

export default ModalComponent
