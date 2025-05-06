'use client'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import React, { type SyntheticEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Tabs() {
  const [value, setValue] = useState<string>('new')
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
    if (newValue === 'new') {
      router.push('/add-management/addprofile') // Navigate to the dashboard route
    } else {
      router.push('/use') // Navigate to the /use route
    }
  }

  return (
    <>
      <TabContext value={value}>
        <TabList variant='standard' onChange={handleChange} aria-label='full width tabs example'>
          <Tab value='new' label='All Profiles' />
          <Tab value='preparing' label='Ads Profile' />
        </TabList>
      </TabContext>
    </>
  )
}
