import Modal from '@mui/material/Modal'
import { FormEvent, useState } from 'react'

interface ModalComponentProps {
  open: boolean
  handleClose: () => void
  children: React.ReactElement
}

const ModalComponent: React.FC<ModalComponentProps> = ({ open, handleClose, children }) => {
  return (
    <Modal
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      open={open}
      onClose={handleClose}
      className='fixed inset-0 flex items-center justify-center'
    
    >
      {children}
    </Modal>
  )
}

export default ModalComponent
