'use client'

// React Imports
import { type ReactNode } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { X } from 'lucide-react'

interface DialogComponentProps {
  open: boolean
  handleClose: () => void
  title?: string
  children: (props: { data: any; handleClose: () => void }) => ReactNode
  actions?: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  data?: any
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  handleClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  data
}) => {
  return (
    <Dialog open={open} maxWidth={maxWidth} fullWidth={fullWidth} onClose={handleClose} aria-labelledby='dialog-title'>
      <DialogTitle id='dialog-title'>
        {title}
        <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <IconButton aria-label='close' onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8 }}>
        <X size={20} />
      </IconButton>
      <DialogContent>{children({ data, handleClose })}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  )
}

export default DialogComponent
