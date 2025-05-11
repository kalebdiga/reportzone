import useDynamicMutation from '@/apihandeler/usePostData'
import { Switch } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ChangeStatus = ({ row }: any) => {
  const [status, setStatus] = useState<boolean>(row?.active)
  const patchMutation = useDynamicMutation({ type: 'Json' })
  console.log(row, 'row')
  const handleUpdate = (id: string) => {
    if (!id) return

    setStatus(prevStatus => !prevStatus)

    patchMutation.mutate({
      url: `/schedules/${id}`,
      method: 'PUT',
      body: {
        id: row?.id,
        day: row?.day,
        hour: row?.hour,
        minute: row?.minute,
        active: status,
        campaignId: row?.campaignId,
        budget: row?.budget,
        state: row?.state,
        createdAt: row?.createdAt,
        updatedAt: row?.updatedAt,
        isAm: row?.hour < 12
      },
      invalidateKey: ['updateScedule'],
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
      <Switch checked={status} onChange={() => handleUpdate(row?.id)} color='primary' />
    </div>
  )
}

export default ChangeStatus
