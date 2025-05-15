'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { Form, Formik } from 'formik'

// Component Imports
import FormikTextField from '@/lib/form/FormikInput'

// Hook Imports
import useDynamicMutation from '@/apihandeler/usePostData'

// Validation Schema
import { passwordSchema } from '@/schema/employeeschema'
import { type UserData } from '@/typs/user.type'
import { X } from 'lucide-react'

const UpdateEmployeePassword = ({ data, handleClose }: { data: UserData; handleClose?: () => void }) => {
  // Hooks
  const router = useRouter()

  // Mutation Hook
  const postMutation = useDynamicMutation({ type: 'Json' })

  // State for password visibility
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  // Validation Schema for Password Change

  const onSubmit = (values: { password: string; confirm_password: string }) => {
    const companyId = (data?.companyUsers[0] as any).companyId
    console.log({ companyId: companyId, userId: data?.user?.id })
    try {
      postMutation.mutate({
        url: '/users/change-password',
        method: 'PUT',
        body: {
          password: values.password,
          companyId: companyId,
          userId: data?.user?.id
        },
        invalidateKey: [['employeeData']],

        onSuccess: data => {
          toast.dismiss()
          router.push('/employees')
          handleClose && handleClose()
        }
      })
    } catch (err) {
      console.error('Error changing password:', err)
      toast.dismiss()
      toast.error('Failed to change password')
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(!isPasswordShown)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(!isConfirmPasswordShown)

  return (
    <div className='flex  justify-center'>
      <div className='flex relative justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-3 md:is-[480px] md:rounded'>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <Formik
            initialValues={{
              password: '',
              confirm_password: ''
            }}
            validationSchema={passwordSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form className='space-y-2 w-full pb-4'>
                <FormikTextField
                  fullWidth
                  label='New Password'
                  placeholder='············'
                  id='outlined-adornment-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  name='password'
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
                <FormikTextField
                  fullWidth
                  label='Confirm Password'
                  placeholder='············'
                  id='outlined-adornment-confirm-password'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  name='confirm_password'
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />

                <Button fullWidth variant='contained' type='submit'>
                  Change Password
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default UpdateEmployeePassword
