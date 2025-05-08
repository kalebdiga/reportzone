'use client'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import React, { type SyntheticEvent, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Tabs() {
  const router = useRouter()
  const pathname = usePathname() // Get the current route
  const [value, setValue] = useState<string>('')

  // Synchronize the tab value with the current route
  useEffect(() => {
    if (pathname === '/add-management/addprofile') {
      setValue('addprofile')
    } else if (pathname === '/add-management/campagines') {
      setValue('campagines')
    }
  }, [pathname])

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
    if (newValue === 'addprofile') {
      router.push('/add-management/addprofile') // Navigate to the addprofile route
    } else if (newValue === 'campagines') {
      router.push('/add-management/campagines') // Navigate to the campagines route
    }
  }

  return (
    <>
      <TabContext value={value}>
        <TabList variant='standard' onChange={handleChange} aria-label='full width tabs example'>
          <Tab value='addprofile' label='All Profiles' />
          <Tab value='campagines' label='Ads Profile' />
        </TabList>
      </TabContext>
    </>
  )
}
