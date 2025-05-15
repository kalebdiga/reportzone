import useDynamicMutation from '@/apihandeler/usePostData'
import { Switch } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ChangeEployeeStatus = ({ row }: any) => {
  const [status, setStatus] = useState(row?.status !== 'suspended')
  const patchMutation = useDynamicMutation({ type: 'Json' })
  console.log(row?.status, 'row')
  const handleUpdate = (id: string) => {
    if (!id) return

    setStatus(prevStatus => !prevStatus)

    patchMutation.mutate({
      url: `/companies`,
      method: 'PATCH',
      body: {
        companyName: null,
        companyId: row?.id,
        account_status: status ? 'suspended' : 'active'
      },
      invalidateKey: [['companyData']],
      onSuccess: data => {
        toast.dismiss()
        toast.dismiss()
      },
      onError: error => {
        console.error('Error updating status:', error)
        setStatus(prevStatus => !prevStatus)
      }
    })
  }

  return (
    <div>
      <Switch checked={status} onChange={() => handleUpdate(row?.id)} color='primary' />
    </div>
  )
}

export default ChangeEployeeStatus
