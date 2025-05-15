'use client'
import React, { useState } from 'react'

import { Chip } from '@mui/material'

import { convertToDateOnly } from '@/utils/dateConverter'

import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

import SadowlessTable from '@/components/layout/shared/table/SadowlessTable'

const handleCopy = (text: string) => {
  copy(text)
}
const OverviewSchedule = ({ data }: { data?: any; handleClose?: () => void }) => {
  const [page, setPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)

  //hooks

  const headers = [
    {
      key: 'campaignName',
      label: 'Campaign Name',
      render: (row: any) => row.campaignName || '-'
    },
    {
      key: 'campaignBudget',
      label: 'Budget',
      render: (row: any) => (row.campaignBudget ? `$${row.campaignBudget}` : '-')
    },
    {
      key: 'campaignState',
      label: 'State',
      render: (row: any) => (
        <Chip
          label={row.campaignState ?? 'No change'}
          color={row.campaignState === 'ENABLED' ? 'success' : row.campaignState === 'PAUSED' ? 'warning' : 'primary'}
          variant='tonal'
        />
      )
    }
  ]

  return (
    <>
      <SadowlessTable
        headers={headers}
        selectionId='SceduleData.id'
        csv={false}
        data={data ?? []}
        action={false}
        number={0}
        isPagination={false}
        page={page}
        setPage={setPage}
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        loading={false}
        setLoading={() => {}}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />

      {/* </div> */}
    </>
  )
}

export default OverviewSchedule
