'use client'

import { useField } from 'formik'
import { MenuItem, Select, FormControl, FormHelperText } from '@mui/material'

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
    <FormControl fullWidth={fullWidth} error={showError} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label className='text-textPrimary text-[0.8rem]' style={{ color: showError ? 'red' : '' }}>
          {label}
        </label>
        <Select {...field} {...props} value={field.value || ''} sx={{ height: '37px' }}>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <FormHelperText>{showError ? meta.error : ''}</FormHelperText>
    </FormControl>
  )
}

export default FormikDropdown
