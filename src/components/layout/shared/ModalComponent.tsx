import Modal from '@mui/material/Modal'
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
      <div className='bg-white p-6 rounded shadow-md'>{children({ data, handleClose })}</div>
    </Modal>
  )
}

export default ModalComponent
