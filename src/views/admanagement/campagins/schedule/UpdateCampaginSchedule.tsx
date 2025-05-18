'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import { Checkbox, MenuItem, IconButton, Chip } from '@mui/material'

// Utility Imports
import { toast } from 'react-toastify'
import { convertNewYorkHourToUtc, getNearestValidTime } from '@/utils/dateConverter'

import CustomTextField from '@/@core/components/mui/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import useDynamicMutation from '@/apihandeler/usePostData'
import { type CampaignSchedule } from '@/typs/campagin.type'

const UpdateCampaginSchedule = ({ data, handleClose }: { data: CampaignSchedule[]; handleClose?: () => void }) => {
  const postMutation = useDynamicMutation({ type: 'Json' })

  const [schedules, setSchedules] = useState<any[]>([])
  useEffect(() => {
    if (data) {
      setSchedules(
        Array.isArray(data)
          ? data.map((item: any) => ({
              day: item.day || null,
              hour: item.hour ?? 0,
              minute: item.minute ?? 0,
              am: item.hour < 12,
              budget: item.budget,
              budgetChange: item.budget !== null,
              state: item.state || '',
              stateChange: item.state !== null
            }))
          : []
      )
    }
  }, [data])

  const addScheduleRow = () => {
    setSchedules([
      ...schedules,
      {
        day: null,
        hour: null,
        minute: 0,
        am: true,
        budget: null,
        budgetChange: false,
        state: '',
        stateChange: false
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
      budgetChange: false,
      state: '',
      stateChange: false
    }
    setSchedules(newItems)
  }

  const deleteScheduleItem = (index: number) => {
    if (schedules.length > 1) {
      const newItems = schedules.filter((_, i) => i !== index)
      setSchedules(newItems)
    }
  }

  const handleSubmit = async () => {
    const scheduleUpdateInputs = schedules.map(item => ({
      id: data?.find((d: any) => d.day === item.day && d.hour === item.hour)?.id || null,
      campaignId: data?.[0]?.campaignId || '',
      day: item.day || 0,
      hour: convertNewYorkHourToUtc(item.hour || 0, item.am) || 0,
      minute: item.minute || 0,
      budget: item.budgetChange ? item.budget : null,
      state: item.stateChange ? item.state?.toUpperCase() : null
    }))

    try {
      postMutation.mutate({
        url: `/schedules/${data[0]?.id}`,
        method: 'PUT',
        body: scheduleUpdateInputs?.[0],
        invalidateKey: [['capaignData'], ['updateScedule']],

        onSuccess: () => {
          toast.dismiss()
          handleClose?.()
        }
      })
    } catch (err) {
      console.error('Error updating schedules:', err)
      toast.dismiss()
      toast.error('Failed to update schedules')
    }
  }

  const validateSchedules = () => {
    return schedules.every(
      item =>
        item.day !== null &&
        item.hour !== null &&
        item.minute !== null &&
        (!item.budgetChange || (item.budgetChange && item.budget !== null && item.budget > 0)) &&
        (!item.stateChange || (item.stateChange && item.state))
    )
  }

  const SceduleData = data?.length === 1 && data?.[0]

  return (
    <>
      <div className='flex justify-between items-center w-full'>
        <div className='w-[60%]'></div>
      </div>
      <div className='flex flex-col gap-6 justify-start w-full'>
        {schedules.map((item, index) => {
          return (
            <div key={index} className='schedule-row items-center flex gap-4'>
              <div className='w-[20%]  mt-[2.3%]'>
                <CustomTextField
                  select
                  fullWidth
                  label='Day'
                  value={item.day || ''}
                  onChange={e => {
                    const newItems = [...schedules]
                    newItems[index].day = parseInt(e.target.value)
                    setSchedules(newItems)
                  }}
                >
                  {days.map(day => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.title}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </div>
              <div className='flex gap-2 w-[20%]  mt-[2.3%]'>
                <CustomTextField
                  select
                  fullWidth
                  label='Time'
                  value={getNearestValidTime(item.hour, item.minute)}
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
                  {hoursWithMinutes.map(time => {
                    return (
                      <MenuItem key={time.label} value={`${time.hour}:${time.minute.toString().padStart(2, '0')}`}>
                        {time.label}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              </div>
              <div className='flex flex-col w-[15%]'>
                <FormControlLabel
                  label='Budget'
                  control={
                    <Checkbox
                      checked={item.budgetChange}
                      onChange={() => {
                        const newItems = [...schedules]
                        newItems[index].budgetChange = !newItems[index].budgetChange
                        setSchedules(newItems)
                      }}
                    />
                  }
                />
                <CustomTextField
                  type='number'
                  value={item.budget || ''}
                  disabled={!item.budgetChange}
                  onChange={e => {
                    const newItems = [...schedules]
                    newItems[index].budget = parseFloat(e.target.value)
                    setSchedules(newItems)
                  }}
                />
              </div>
              <div className='flex flex-col w-[20%]'>
                <FormControlLabel
                  label='State'
                  control={
                    <Checkbox
                      checked={item.stateChange}
                      onChange={() => {
                        const newItems = [...schedules]
                        newItems[index].stateChange = !newItems[index].stateChange
                        setSchedules(newItems)
                      }}
                    />
                  }
                />
                <CustomTextField
                  select
                  fullWidth
                  value={item.state || ''}
                  disabled={!item.stateChange}
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
              <div className=' mt-[4%]'>
                <IconButton onClick={() => clearScheduleItem(index)} className=' text-blue-900'>
                  <i className='tabler-x text-textSecondary' />
                </IconButton>
                {index > 0 && (
                  <IconButton onClick={() => deleteScheduleItem(index)}>
                    <i className='tabler-trash text-textSecondary' />
                  </IconButton>
                )}
              </div>
            </div>
          )
        })}

        <div className='flex gap-4 w-full justify-end items-end'>
          <Button variant='outlined' onClick={handleClose}>
            Close
          </Button>
          <Button variant='contained' onClick={handleSubmit} disabled={!validateSchedules()}>
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}

export default UpdateCampaginSchedule

// Days of the week
export const days = [
  // { value: , title: 'Sunday' },
  { value: 1, title: 'Monday' },
  { value: 2, title: 'Tuesday' },
  { value: 3, title: 'Wednesday' },
  { value: 4, title: 'Thursday' },
  { value: 5, title: 'Friday' },
  { value: 6, title: 'Saturday' },
  { value: 0, title: 'Sunday' },
  { value: 7, title: 'Sunday' }
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
