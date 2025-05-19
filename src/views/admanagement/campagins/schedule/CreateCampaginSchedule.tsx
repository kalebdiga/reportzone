'use client'

// React Imports
import React, { useEffect, useState } from 'react'

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
import useDynamicMutation from '@/apihandeler/usePostData'
import OverView from './OverView'
import { formatUSD } from '@/utils/usdFormat'
import ValidationTable from './ValidationTable'

const CreateCampaginSchedule = ({ data: Camp, handleClose }: { data: any; handleClose?: () => void }) => {
  const postMutation = useDynamicMutation({ type: 'Json' })
  const data = Camp.data

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
        budgetChange: true,
        state: '',
        stateChange: true
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
      budgetChange: true,
      state: '',
      stateChange: true
    }
    setSchedules(newItems)
  }

  const deleteScheduleItem = (index: number) => {
    if (schedules.length > 1) {
      const newItems = schedules.filter((_, i) => i !== index)
      setSchedules(newItems)
    }
  }

  const [givePermission, setGivePermission] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [filteredInputs, setFilteredInputs] = useState<any[]>([])
  const [unFilteredInputs, setUnFilteredInputs] = useState<any[]>([])

  const submitSchedules = async (inputs: any[]) => {
    try {
      await postMutation.mutateAsync({
        url: '/schedules',
        method: 'POST',
        body: inputs,
        invalidateKey: [['capaignData'], ['updateScedule']]
      })

      toast.dismiss()
      handleClose?.()
    } catch (err) {
      console.error('Error creating schedules:', err)
      toast.dismiss()
      toast.error('Failed to create schedules.')
    }
  }
  const SceduleData = data?.length === 1 && data?.[0]

  useEffect(() => {
    if (givePermission && filteredInputs.length > 0) {
      submitSchedules(filteredInputs)
      setGivePermission(false)
      setOpenConfirmation(false)
      setFilteredInputs([])
    }
  }, [givePermission])

  const handleSubmit = async () => {
    const scheduleCreationInputs = data?.flatMap((campaign: any) =>
      schedules.map((item, idx) => ({
        campaignId: campaign.id || '',
        companyId: campaign.companyId || '',
        day: item.day || 0,
        hour: item.hour || 0,
        minute: item.minute || 0,
        budget: item.budgetNoChange ? undefined : item.budget,
        campaignState: item.stateNoChange ? null : item.state?.toUpperCase() || null,
        index: idx,
        name: campaign?.campaignName,
        active: true
      }))
    )

    const scheduleCreationInputsForMultipleCampagin = data?.flatMap((campaign: any, index: any) => {
      return schedules.map((item, idx) => {
        return {
          campaignId: campaign?.original?.id || '',
          companyId: campaign?.original?.companyId || '',
          day: item.day || 0,
          hour: convertNewYorkHourToUtc(item.hour || 0, item.am) || 0,
          minute: item.minute || 0,
          budget: item.budgetNoChange ? undefined : item.budget,
          campaignState: item.stateNoChange ? null : item.state?.toUpperCase() || null,
          index: index,
          name: campaign?.original?.campaignName,
          active: true
        }
      })
    })

    try {
      const checkResponse = await postMutation.mutateAsync({
        url: '/check/schedules',
        method: 'POST',
        body: SceduleData ? scheduleCreationInputs : scheduleCreationInputsForMultipleCampagin
      })

      if (!Array.isArray(checkResponse) || checkResponse.length === 0) {
        await submitSchedules(SceduleData ? scheduleCreationInputs : scheduleCreationInputsForMultipleCampagin)
      } else {
        setUnFilteredInputs(SceduleData ? scheduleCreationInputs : scheduleCreationInputsForMultipleCampagin)
        const conflictIndexes = checkResponse.map((conflict: any) => conflict.index)
        const filtered = (SceduleData ? scheduleCreationInputs : scheduleCreationInputsForMultipleCampagin).filter(
          (_: any, idx: any) => !conflictIndexes.includes(idx)
        )

        if (filtered.length === 0) {
          toast.dismiss()
          setOpenConfirmation(true)

          return
        }

        setFilteredInputs(filtered)
        setOpenConfirmation(true)
      }
    } catch (err) {
      console.error('Error checking conflicts:', err)
      toast.dismiss()
      toast.error('Failed to check schedule conflicts.')
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
          {data?.data?.length > 1 && (
            <Button
              onClick={() => {
                setOpenSceduleTable(true)
              }}
              variant='contained'
            >
              {data?.data?.length} Schedules
            </Button>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-6   justify-start  w-full'>
        {schedules.map((item, index) => (
          <>
            <div key={index} className='schedule-row items-center flex gap-4'>
              <div className=' w-[20%] mt-[2%]'>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=''
                  label='Day'
                  id='custom-select'
                  value={item.day ?? ''}
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
              </div>
              <div className='flex flex-col justify-start w-[15%]'>
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
              <div className=' mt-[4%]'>
                <IconButton onClick={() => clearScheduleItem(index)} className=' text-blue-900'>
                  <i className='tabler-restore text-textSecondary' />
                </IconButton>

                {index > 0 && (
                  <IconButton onClick={() => deleteScheduleItem(index)}>
                    <i className='tabler-trash text-textSecondary' />
                  </IconButton>
                )}
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
        data={data.data}
        maxWidth='sm'
        title='schedule'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <OverView data={data} handleClose={handleClose} />
        )}
      </DialogComponent>

      <DialogComponent
        open={openConfirmation}
        handleClose={() => setOpenConfirmation(false)}
        data={{
          unfiltered: unFilteredInputs,
          filtered: filteredInputs
        }}
        title='Duplicate schedule detected.'
        maxWidth='sm'
        actions={
          <>
            {filteredInputs.length !== 0 ? (
              <>
                <Button
                  onClick={() => {
                    setGivePermission(false)
                  }}
                  size='small'
                  variant='contained'
                  color='error'
                >
                  No
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  onClick={() => {
                    setGivePermission(true)
                  }}
                >
                  Yes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setOpenConfirmation(false)
                  setGivePermission(false)
                }}
              >
                close
              </Button>
            )}
          </>
        }
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => <ValidationTable data={data} />}
      </DialogComponent>
    </>
  )
}

export default CreateCampaginSchedule

// Days of the week
export const days = [
  // { value: , title: 'Sunday' },
  { value: 7, title: 'Everyday' },
  { value: 1, title: 'Monday' },
  { value: 2, title: 'Tuesday' },
  { value: 3, title: 'Wednesday' },
  { value: 4, title: 'Thursday' },
  { value: 5, title: 'Friday' },
  { value: 6, title: 'Saturday' },
  { value: 0, title: 'Sunday' }
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
