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
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
  selectedEvent?: any
  onSubmitEvent: (event: DefaultStateType) => void
  onDeleteEvent?: (eventId: number) => void
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

const AddEventSidebar = ({
  addEventSidebarOpen,
  handleAddEventSidebarToggle,
  selectedEvent,
  onSubmitEvent,
  onDeleteEvent
}: AddEventSidebarProps) => {
  const [values, setValues] = useState<DefaultStateType>(defaultState)
  const [useRange, setUseRange] = useState(true)

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

  useEffect(() => {
    if (selectedEvent) {
      const event = selectedEvent
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        guests: event.extendedProps.guests || [],
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end || event.start,
        startDate: event.start || new Date()
      })
    } else {
      setValues(defaultState)
    }
  }, [selectedEvent, addEventSidebarOpen])

  const handleSidebarClose = () => {
    setValues(defaultState)
    handleAddEventSidebarToggle()
  }

  const ScrollWrapper = isBelowSmScreen ? 'div' : PerfectScrollbar

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
    >
      <Box className='flex justify-between items-center sidebar-header plb-5 pli-6 border-be'>
        <Typography variant='h5'>{selectedEvent ? 'Update Event' : 'Add Event'}</Typography>
        <Box className='flex items-center'>
          {selectedEvent && (
            <IconButton size='small' onClick={() => onDeleteEvent?.(selectedEvent.id)}>
              <i className='tabler-trash text-2xl text-textPrimary' />
            </IconButton>
          )}
          <IconButton size='small' onClick={handleSidebarClose}>
            <i className='tabler-x text-2xl text-textPrimary' />
          </IconButton>
        </Box>
      </Box>

      <ScrollWrapper
        {...(isBelowSmScreen
          ? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
          : { options: { wheelPropagation: false, suppressScrollX: true } })}
      >
        <Box className='sidebar-body plb-5 pli-6'>
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
              handleSidebarClose()
            }}
          >
            {({ values, errors, handleChange, setFieldValue }) => (
              <Form className='flex flex-col gap-6'>
                {/* Date Picker: Start */}
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

                {/* Conditionally show End Date */}
                {useRange && (
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

                <div className='flex gap-4'>
                  <Button type='submit' variant='contained'>
                    {selectedEvent ? 'Update' : 'Add'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default AddEventSidebar
