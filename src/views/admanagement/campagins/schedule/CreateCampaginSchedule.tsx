'use client'

// React Imports
import React, { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Utility Imports
import { toast } from 'react-toastify'
import { convertNewYorkHourToUtc } from '@/utils/dateConverter'
import { Form, Formik } from 'formik'
import FormikDropdown from '@/lib/form/FormikDropDown'
import CustomTextField from '@/@core/components/mui/TextField'
import { Checkbox, MenuItem } from '@mui/material'

import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogComponent from '@/components/layout/shared/DialogsSizes'

const CreateCampaginSchedule = ({ data, handleClose }: { data: any; handleClose?: () => void }) => {
  const [schedules, setSchedules] = useState<any[]>([
    { day: null, hour: null, minute: 0, am: true, budget: null, budgetNoChange: false, state: '', stateNoChange: false }
  ])

  const addScheduleRow = () => {
    setSchedules([
      ...schedules,
      {
        day: null,
        hour: null,
        minute: 0,
        am: true,
        budget: null,
        budgetNoChange: false,
        state: '',
        stateNoChange: false
      }
    ])
  }

  const clearScheduleItem = (index: number) => {
    const newItems = [...schedules]
    newItems[index] = {
      day: null,
      hour: null,
      minute: 0,
      am: true,
      budget: null,
      budgetNoChange: false,
      state: '',
      stateNoChange: false
    }
    setSchedules(newItems)
  }

  const deleteScheduleItem = (index: number) => {
    if (schedules.length > 1) {
      const newItems = schedules.filter((_, i) => i !== index)
      setSchedules(newItems)
    }
  }

  const handleSubmit = () => {
    console.log(data)
    const scheduleCreationInputs = data?.flatMap((campaign: any) =>
      schedules.map(item => ({
        campaignId: campaign.id || '',
        companyId: campaign.companyId || '',
        day: item.day || 0,
        hour: convertNewYorkHourToUtc(item.hour || 0, item.am) || 0,
        minute: item.minute || 0,
        budget: item.budgetNoChange ? undefined : item.budget,
        campaignState: item.stateNoChange ? null : item.state?.toUpperCase() || null,
        index: 0
      }))
    )
    console.log('Submitted Schedules:', scheduleCreationInputs)
    toast.success('Schedules submitted successfully!')
  }

  return (
    <>
      <div className='flex justify-between items-center my-[3%]'>
        <div className='w-[60%]'>
          <div className='w-full flex items-center gap-3'>
            <Typography variant='h6'>Name: {data?.campaignName}</Typography>
          </div>
          <div className='w-full flex items-center gap-3'>
            <Typography variant='h6'>Budget: {data?.campaignBudget}</Typography>
          </div>
          <div className='w-full flex items-center gap-3'>
            <Typography variant='h6'>Status: {data?.campaignState}</Typography>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        {schedules.map((item, index) => (
          <>
            <div key={index} className='schedule-row flex flex-wrap gap-4'>
              <div>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=''
                  label='Day'
                  id='custom-select'
                  value={item.day || ''}
                  onChange={e => {
                    const newItems = [...schedules]
                    newItems[index].day = parseInt(e.target.value)
                    setSchedules(newItems)
                  }}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {days.map(day => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.title}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </div>

              <div className=' flex gap-2'>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=''
                  label='Time'
                  id='custom-select'
                  value={item.hour && item.minute !== null ? `${item.hour}:${item.minute}` : ''}
                  onChange={e => {
                    const [hour, minute] = e.target.value.split(':').map(Number)
                    const newItems = [...schedules]
                    newItems[index].hour = hour
                    newItems[index].minute = minute
                    setSchedules(newItems)
                  }}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {hoursWithMinutes.map(time => (
                    <MenuItem key={time.label} value={`${time.hour}:${time.minute}`}>
                      {time.label}
                    </MenuItem>
                  ))}
                </CustomTextField>

                <Button
                  onClick={() => {
                    const newItems = [...schedules]
                    newItems[index].am = !newItems[index].am
                    setSchedules(newItems)
                  }}
                >
                  {item.am ? 'AM' : 'PM'}
                </Button>
              </div>
              <div className=' flex flex-col'>
                <FormControlLabel
                  label='Budget'
                  control={
                    <Checkbox
                      checked={item.budgetNoChange}
                      onChange={() => {
                        const newItems = [...schedules]
                        newItems[index].budgetNoChange = !newItems[index].budgetNoChange
                        if (newItems[index].budgetNoChange) newItems[index].budget = null
                        setSchedules(newItems)
                      }}
                      name='Budget'
                    />
                  }
                />
                <CustomTextField
                  type='number'
                  value={item.budget || ''}
                  disabled={item.budgetNoChange}
                  onChange={e => {
                    const newItems = [...schedules]
                    newItems[index].budget = parseFloat(e.target.value)
                    setSchedules(newItems)
                  }}
                />
              </div>
              <div className=' flex flex-col'>
                <FormControlLabel
                  label='State'
                  control={
                    <Checkbox
                      checked={item.stateNoChange}
                      onChange={() => {
                        const newItems = [...schedules]
                        newItems[index].stateNoChange = !newItems[index].stateNoChange
                        if (newItems[index].stateNoChange) newItems[index].state = ''
                        setSchedules(newItems)
                      }}
                    />
                  }
                />

                <CustomTextField
                  select
                  fullWidth
                  label='State'
                  defaultValue=''
                  value={item.state || ''}
                  disabled={item.stateNoChange}
                  onChange={e => {
                    const newItems = [...schedules]
                    newItems[index].state = e.target.value
                    setSchedules(newItems)
                  }}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>

                  {states.map(state => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </div>
              <div>
                <Button onClick={() => clearScheduleItem(index)}>Clear</Button>
                {index > 0 && <Button onClick={() => deleteScheduleItem(index)}>Delete</Button>}
              </div>
            </div>
          </>
        ))}
        <div className='flex gap-4'>
          <Button variant='outlined' onClick={addScheduleRow}>
            Add Row
          </Button>
          <Button variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}

export default CreateCampaginSchedule

// Days of the week
export const days = [
  { value: 0, title: 'Sunday' },
  { value: 1, title: 'Monday' },
  { value: 2, title: 'Tuesday' },
  { value: 3, title: 'Wednesday' },
  { value: 4, title: 'Thursday' },
  { value: 5, title: 'Friday' },
  { value: 6, title: 'Saturday' }
]

// States for the schedule
export const states = ['ENABLED', 'PAUSED', 'ARCHIVED']

// Hours with minutes for time selection
export const hoursWithMinutes = Array.from({ length: 24 }, (_, hour) =>
  [0, 15, 30, 45].map(minute => ({
    hour,
    minute,
    label: `${hour % 12 === 0 ? 12 : hour % 12}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
  }))
).flat()
