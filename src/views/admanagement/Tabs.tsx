'use client'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import React, { Fragment, SyntheticEvent, useState } from 'react'
const data = {
  new: [
    {
      sender: {
        name: 'Micheal Hughes',
        address: '101 Boulder, California (CA), 933130'
      },
      receiver: {
        name: 'Daisy Coleman',
        address: '939 Orange, California (CA), 910614'
      }
    },
    {
      sender: {
        name: 'Glenn Todd',
        address: '1713 Garnet, California (CA), 939573'
      },
      receiver: {
        name: 'Arthur West',
        address: '156 Blaze, California (CA), 925878'
      }
    }
  ],
  preparing: [
    {
      sender: {
        name: 'Rose Cole',
        address: '61 Unions, California (CA), 922523'
      },
      receiver: {
        name: 'Polly Spencer',
        address: '865 Delta, California (CA), 932830'
      }
    },
    {
      sender: {
        name: 'Jerry Wood',
        address: '37 Marjory, California (CA), 951958'
      },
      receiver: {
        name: 'Sam McCormick',
        address: '926 Reynolds, California (CA), 910279'
      }
    }
  ],
  shipping: [
    {
      sender: {
        name: 'Alex Walton',
        address: '78 Judson, California (CA), 956084'
      },
      receiver: {
        name: 'Eula Griffin',
        address: '56 Bernard, California (CA), 965133'
      }
    },
    {
      sender: {
        name: 'Lula Barton',
        address: '95 Gaylord, California (CA), 991955'
      },
      receiver: {
        name: 'Craig Jacobs',
        address: '73 Sandy, California (CA), 954566'
      }
    }
  ]
}
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
