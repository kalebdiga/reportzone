import DialogComponent from '@/components/layout/shared/DialogsSizes'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import CampaginsLogsTable from '../tables/CampaginsLogsTable'

export function useCampaignLogModal() {
  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState<any>(null)

  const trigger = (rowData: any) => {
    console.log(rowData, 'rowData')
    return (
      <IconButton
        onClick={() => {
          setModalData(rowData)
          setOpenModal(true)
        }}
      >
        <i className='tabler-report text-textSecondary' />
      </IconButton>
    )
  }

  const menuOption = (rowData: any) => ({
    text: 'Logs',
    icon: 'tabler-report',
    menuItemProps: {
      onClick: () => {
        setModalData(rowData)
        setOpenModal(true)
      }
    }
  })

  const dialog = modalData && (
    <DialogComponent
      open={openModal}
      handleClose={() => setOpenModal(false)}
      data={modalData}
      maxWidth='lg'
      title={`Logs of ${modalData?.original?.campaignName}`}
    >
      {({ data }: { data: any }) => <CampaginsLogsTable data={data} />}
    </DialogComponent>
  )

  return { trigger, menuOption, dialog }
}
