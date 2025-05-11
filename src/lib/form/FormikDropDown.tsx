'use client'

import { useField } from 'formik'
import { MenuItem, Select, FormControl, FormHelperText } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'

type FormikDropdownProps = {
  name: string
  label: string
  options: { value: string | number; label: string }[] // Dropdown options
  fullWidth?: boolean
}

const FormikDropdown = ({ name, label, options, fullWidth = true, ...props }: FormikDropdownProps) => {
  const [field, meta] = useField(name)

  const showError = Boolean(meta.touched && meta.error)
  return (
    <FormControl fullWidth={fullWidth} error={showError} style={{ marginBottom: '1rem' }} {...props}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <label className='text-textPrimary text-[0.8rem]' style={{ color: showError ? 'red' : '' }}>
          {label}
        </label> */}
        <CustomTextField select {...field} {...props} value={field.value || ''} label={label} id='custom-select'>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </CustomTextField>
      </div>
      <FormHelperText>{showError ? meta.error : ''}</FormHelperText>
    </FormControl>
  )
}

{
  /* <CustomTextField select fullWidth defaultValue='' label='Default' id='custom-select'>
<MenuItem value=''>
  <em>None</em>
</MenuItem>
<MenuItem value={10}>Ten</MenuItem>
<MenuItem value={20}>Twenty</MenuItem>
<MenuItem value={30}>Thirty</MenuItem>
</CustomTextField> */
}

export default FormikDropdown
