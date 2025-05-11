import useDynamicMutation from '@/apihandeler/usePostData'
import { Switch } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ChangeEployeeStatus = ({ row }: any) => {
  const [status, setStatus] = useState(row?.user?.accountStatus !== 'suspended')
  const patchMutation = useDynamicMutation({ type: 'Json' })

  const handleUpdate = (id: string) => {
    if (!id) return

    setStatus(prevStatus => !prevStatus)

    patchMutation.mutate({
      url: `/users/${id}`,
      method: 'PATCH',
      body: {
        fname: null,
        lname: null,
        email: null,
        account_status: status ? 'suspended' : 'active'
      },
      invalidateKey: ['employeeData', 'CompanyEmployees'],
      onSuccess: data => {
        toast.dismiss()
        toast.success('Status updated successfully')
      },
      onError: error => {
        console.error('Error updating status:', error)
        setStatus(prevStatus => !prevStatus)
      }
    })
  }

  return (
    <div>
      <Switch checked={status} onChange={() => handleUpdate(row?.user?.id)} color='primary' />
    </div>
  )
}

export default ChangeEployeeStatus
