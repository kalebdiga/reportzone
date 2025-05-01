'use client'

import { useField } from 'formik'
import type { TextFieldProps } from '@mui/material/TextField'
import CustomTextField from '@/@core/components/mui/TextField'

type FormikTextFieldProps = TextFieldProps & {
  name: string
}

const FormikTextField = ({ name, ...props }: FormikTextFieldProps) => {
  const [field, meta] = useField(name)

  const showError = Boolean(meta.touched && meta.error)

  return (
    <CustomTextField {...field} {...props} error={showError} helperText={showError ? meta.error : props.helperText} />
  )
}

export default FormikTextField
