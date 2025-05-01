'use client'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import React, { type SyntheticEvent, useState } from 'react'

export default function Tabs() {
  const [value, setValue] = useState<string>('new')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  return (
    <>
      <TabContext value={value}>
        <TabList variant='standard' onChange={handleChange} aria-label='full width tabs example'>
          <Tab value='new' label='All Profiles' />
          <Tab value='preparing' label='Ads Profile' />
        </TabList>
        <TabPanel value={value} className='pbs-0'>
          <CardContent>
            {value === 'new' ? (
              <div className=' size-48 text-center'>All profile Table</div>
            ) : (
              <div className=' size-48 text-center'>Ads Table</div>
            )}
          </CardContent>
        </TabPanel>
      </TabContext>
    </>
  )
}
