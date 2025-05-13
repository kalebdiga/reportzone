'use client'

// React Imports
import React, { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Utility Imports
import { toast } from 'react-toastify'
import { convertNewYorkHourToUtc } from '@/utils/dateConverter'

import CustomTextField from '@/@core/components/mui/TextField'
import { Checkbox, Chip, IconButton, MenuItem } from '@mui/material'

import FormControlLabel from '@mui/material/FormControlLabel'
import DialogComponent from '@/components/layout/shared/DialogsSizes'
import OverviewSchedule from './OverviewSchedule'
import useDynamicMutation from '@/apihandeler/usePostData'
import UpdateCampaginSchedule from './UpdateCampaginSchedule'
import { UserData } from '@/typs/user.type'
import OverView from './OverView'
import { formatUSD } from '@/utils/usdFormat'

const CreateCampaginSchedule = ({ data, handleClose }: { data: any; handleClose?: () => void }) => {
  const postMutation = useDynamicMutation({ type: 'Json' })

  const [openSceduleTable, setOpenSceduleTable] = useState(false)

  const [schedules, setSchedules] = useState<any[]>([
    { day: null, hour: null, minute: 0, am: true, budget: null, budgetChange: true, state: '', stateChange: true }
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

  const handleSubmit = async () => {
    const scheduleCreationInputs = data?.flatMap((campaign: any) =>
      schedules.map(item => ({
        campaignId: campaign.original?.id || '',
        companyId: campaign.original?.companyId || '',
        day: item.day || 0,
        hour: convertNewYorkHourToUtc(item.hour || 0, item.am) || 0,
        minute: item.minute || 0,
        budget: item.budgetNoChange ? undefined : item.budget,
        campaignState: item.stateNoChange ? null : item.state?.toUpperCase() || null,
        index: 0
      }))
    )

    try {
      postMutation.mutate({
        url: '/schedules',
        method: 'POST',
        body: scheduleCreationInputs,
        invalidateKey: [['capaignData'], ['updateScedule']],

        onSuccess: data => {
          toast.dismiss()
          toast.success(' Schedules submitted successfully!')
          handleClose?.()
        }
      })
    } catch (err) {
      console.error('Error creating :', err)
      toast.dismiss()
      toast.error('Failed to create ')
    }
  }
  const SceduleData = data?.length === 1 && data?.[0]

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

  return (
    <>
      <div className='flex justify-between items-center w-full'>
        <div className='w-[60%]'>
          {SceduleData && (
            <>
              <div className='w-full flex items-center gap-3'>
                <Typography>Name: {SceduleData?.campaignName}</Typography>
              </div>
              <div className='w-full flex items-center gap-3'>
                <Typography>Budget: {formatUSD(SceduleData?.campaignBudget)}</Typography>
              </div>
              <div className='w-full flex items-center gap-3'>
                <Typography>
                  Status:{' '}
                  <Chip
                    label={SceduleData.campaignState}
                    color={SceduleData.campaignState === 'ENABLED' ? 'success' : 'warning'}
                    variant='tonal'
                    size='small'
                  />
                </Typography>
              </div>
            </>
          )}
          {data?.length > 1 && (
            <Button
              onClick={() => {
                setOpenSceduleTable(true)
              }}
              variant='contained'
            >
              Schedules
            </Button>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-6   justify-start  w-full'>
        {schedules.map((item, index) => (
          <>
            <div key={index} className='schedule-row items-center flex flex-wrap gap-4'>
              <div className=' w-[20%] mt-[2%]'>
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
                  {days.map(day => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.title}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </div>

              <div className=' flex gap-2 w-[20%] mt-[2%]'>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=''
                  label='Time'
                  id='custom-select'
                  value={item.hour !== null && item.minute !== null ? `${item.hour}:${item.minute}` : ''}
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
                {/* <div className='mt-[13%]'>
                  <Button
                    onClick={() => {
                      const newItems = [...schedules]
                      newItems[index].am = !newItems[index].am
                      setSchedules(newItems)
                    }}
                  >
                    {item.am ? 'AM' : 'PM'}
                  </Button>
                </div> */}
              </div>
              <div className='flex flex-col justify-start w-[20%]'>
                <FormControlLabel
                  label='Budget'
                  control={
                    <Checkbox
                      checked={item.budgetChange}
                      onChange={() => {
                        const newItems = [...schedules]
                        newItems[index].budgetChange = !newItems[index].budgetChange
                        if (!newItems[index].budgetChange && !newItems[index].stateChange) {
                          newItems[index].stateChange = true // Automatically uncheck State
                        }
                        setSchedules(newItems)
                      }}
                      name='Budget'
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
                  className='w-[100%]'
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
                        if (!newItems[index].stateChange && !newItems[index].budgetChange) {
                          newItems[index].budgetChange = true
                        }
                        setSchedules(newItems)
                      }}
                    />
                  }
                />
                <CustomTextField
                  select
                  fullWidth
                  label=''
                  defaultValue=''
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
              <div>
                <Button onClick={() => clearScheduleItem(index)}>Clear</Button>
                {index > 0 && <Button onClick={() => deleteScheduleItem(index)}>Delete</Button>}
              </div>
            </div>
          </>
        ))}

        <div className=' w-full border-t-2 pt-[1%]'>
          <Button size='small' variant='contained' onClick={addScheduleRow} disabled={!validateSchedules()}>
            Add
          </Button>
        </div>
        <div className='flex gap-4 w-full justify-end items-end'>
          <Button variant='outlined' onClick={handleClose}>
            Close
          </Button>
          <Button variant='contained' onClick={handleSubmit} disabled={!validateSchedules()}>
            Submit
          </Button>
        </div>
      </div>

      <DialogComponent
        open={openSceduleTable}
        handleClose={() => setOpenSceduleTable(false)}
        data={data}
        maxWidth='sm'
        title='Scedule'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <OverView data={data} handleClose={handleClose} />
        )}
      </DialogComponent>
    </>
  )
}

export default CreateCampaginSchedule

// Days of the week
export const days = [
  // { value: , title: 'Sunday' },
  { value: 1, title: 'Monday' },
  { value: 2, title: 'Tuesday' },
  { value: 3, title: 'Wednesday' },
  { value: 4, title: 'Thursday' },
  { value: 5, title: 'Friday' },
  { value: 6, title: 'Saturday' },
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
