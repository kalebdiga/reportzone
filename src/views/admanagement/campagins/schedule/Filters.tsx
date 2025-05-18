// React Imports
import { useEffect, useState, forwardRef } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/lib/AppReactDatepicker'

// Types
import type { Theme } from '@mui/material/styles'
import { MenuItem } from '@mui/material'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  url: string
  title: string
  allDay: boolean
  calendar: string
  description: string
  endDate: Date
  startDate: Date
  guests: string[]
}

interface AddEventSidebarProps {
  onSubmitEvent: (event: DefaultStateType) => void
}

const defaultState: DefaultStateType = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('This field is required')
})

const capitalize = (string: string) => string && string[0].toUpperCase() + string.slice(1)

const Filters = ({ onSubmitEvent }: AddEventSidebarProps) => {
  const [values, setValues] = useState<DefaultStateType>(defaultState)
  const [useRange, setUseRange] = useState(false)

  const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => (
    <CustomTextField
      inputRef={ref}
      fullWidth
      {...props}
      label={props.label || ''}
      className='is-full'
      error={props.error}
    />
  ))

  const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Box className=' w-full'>
      <Formik
        enableReinitialize
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={values => {
          const modified = {
            ...values,
            endDate: useRange ? values.endDate : values.startDate,
            calendar: capitalize(values.calendar),
            guests: values.guests.length ? values.guests : [],
            description: values.description.length ? values.description : ''
          }
          onSubmitEvent(modified)
        }}
      >
        {({ values, errors, handleChange, setFieldValue }) => (
          <Form className='flex gap-6 w-full items-center'>
            {/* Date Picker: Start */}
            <div className='w-[30%]'>
              <CustomTextField
                select
                fullWidth
                defaultValue=''
                label='By'
                id='custom-select'
                value={'state'}

                // onChange={e => {
                //   setState(e.target.value)
                // }}
              >
                {['Camapgin', 'Keywords']?.map((item: any, index: number) => (
                  <MenuItem key={index} value={item} className='text-gray-950'>
                    {item}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>

            <FormControl>
              <FormControlLabel
                label='Range'
                control={
                  <Switch
                    checked={useRange}
                    onChange={e => {
                      setUseRange(e.target.checked)
                      if (!e.target.checked) setFieldValue('endDate', values.startDate)
                    }}
                  />
                }
              />
            </FormControl>

            {/* Conditionally show End Date */}
            {useRange && (
              <>
                <AppReactDatepicker
                  selectsStart
                  id='event-start-date'
                  endDate={values.endDate}
                  selected={values.startDate}
                  startDate={values.startDate}
                  showTimeSelect={!values.allDay}
                  dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                  customInput={<PickersComponent label='Start Date' />}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setFieldValue('startDate', new Date(date))
                      if (!useRange) setFieldValue('endDate', new Date(date))
                    }
                  }}
                />
                <AppReactDatepicker
                  selectsEnd
                  id='event-end-date'
                  endDate={values.endDate}
                  selected={values.endDate}
                  minDate={values.startDate}
                  startDate={values.startDate}
                  showTimeSelect={!values.allDay}
                  dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                  customInput={<PickersComponent label='End Date' />}
                  onChange={(date: Date | null) => date && setFieldValue('endDate', new Date(date))}
                />
              </>
            )}

            {!useRange && (
              <>
                <AppReactDatepicker
                  selectsStart
                  id='event-start-date'
                  endDate={values.endDate}
                  selected={values.startDate}
                  startDate={values.startDate}
                  showTimeSelect={!values.allDay}
                  dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                  customInput={<PickersComponent label='Date' />}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setFieldValue('startDate', new Date(date))
                      if (!useRange) setFieldValue('endDate', new Date(date))
                    }
                  }}
                />
              </>
            )}

            {/* All Day Switch */}
            {/* <FormControl>
                  <FormControlLabel
                    label='All Day'
                    control={
                      <Switch checked={values.allDay} onChange={e => setFieldValue('allDay', e.target.checked)} />
                    }
                  />
                </FormControl> */}

            {/* Range Switch */}

            <Button type='submit' variant='contained' className=' w-[18%] h-[80%] mt-[1.4%]'>
              Filter
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default Filters
