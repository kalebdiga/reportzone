'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, ButtonGroup } from '@mui/material'

export default function Tabs() {
  const router = useRouter()
  const pathname = usePathname()

  // Determine which button is active based on the path
  const isAddProfile = pathname === '/add-management/addprofile'
  const isCampaigns = pathname === '/add-management/campagines'

  return (
    <ButtonGroup variant='contained'>
      <Button
        onClick={() => router.push('/add-management/addprofile')}
        variant={isAddProfile ? 'contained' : 'outlined'}
      >
        All Profiles
      </Button>
      <Button
        onClick={() => router.push('/add-management/campagines')}
        variant={isCampaigns ? 'contained' : 'outlined'}
      >
        Detail Campaigns
      </Button>
    </ButtonGroup>
  )
}
