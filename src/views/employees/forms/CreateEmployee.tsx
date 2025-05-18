'use client'

// React Imports
import { toast } from 'react-toastify'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import { Form, Formik } from 'formik'

// Component Imports
import FormikTextField from '@/lib/form/FormikInput'
import FormikDropdown from '@/lib/form/FormikDropDown'

// Hook Imports
import useDynamicMutation from '@/apihandeler/usePostData'

// Validation Schema
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'

// Lucide React Imports
import { ArrowLeft, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createEmployeeSchema } from '@/schema/employeeschema'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CreateEmployee = ({ handleClose }: { handleClose?: () => void }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  // Hooks
  const { data } = useSession()
  const router = useRouter()

  // Mutation Hook
  const postMutation = useDynamicMutation({ type: 'Json' })

  // Validation Schema

  const handleClickShowPassword = () => setIsPasswordShown(!isPasswordShown)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(!isConfirmPasswordShown)

  const onSubmit = (
    values: { fname: string; lname: string; email: string; role: string; password: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    const companyId = (data?.user as any)?.companyUser?.[0]?.companyId

    if (!companyId) return
    try {
      postMutation.mutate({
        url: '/users',
        method: 'POST',
        body: {
          fname: values.fname,
          lname: values.lname,
          email: values.email,
          role: values.role,
          password: values.password,
          company_id: companyId
        },
        invalidateKey: [['employeeData']],

        onSuccess: data => {
          toast.dismiss()
          resetForm()
          handleClose?.()
          !handleClose && router.push('/employees')
        }
      })
    } catch (err) {
      console.error('Error creating employee:', err)
      toast.dismiss()
      toast.error('Failed to create employee')
    }
  }

  return (
    <>
      <div className='flex justify-center max-md:h-[90svh] max-md:overflow-y-auto bg-backgroundPaper'>
        <div className='relative flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[600px] md:rounded-md'>
          <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
            <Formik
              initialValues={{
                fname: '',
                lname: '',
                email: '',
                role: '',
                password: '',
                confirm_password: ''
              }}
              validationSchema={createEmployeeSchema}
              onSubmit={onSubmit}
            >
              {() => (
                <Form className='space-y-5 w-full pb-4'>
                  <div className='flex flex-wrap gap-4'>
                    <div className='flex flex-col w-full md:w-[48%]'>
                      <FormikTextField name='fname' label='First Name' fullWidth />
                    </div>
                    <div className='flex flex-col w-full md:w-[48%]'>
                      <FormikTextField name='lname' label='Last Name' fullWidth />
                    </div>
                    <div className='flex flex-col w-full md:w-[48%]'>
                      <FormikTextField name='email' label='Email' fullWidth />
                    </div>
                    <div className='flex flex-col w-full md:w-[48%]'>
                      <FormikDropdown
                        name='role'
                        label='Role'
                        options={[
                          { value: 'admin', label: 'Admin' },
                          { value: 'employee', label: 'User' }
                        ]}
                        fullWidth
                      />
                    </div>
                    <div className='flex flex-col w-full md:w-[48%]'>
                      <FormikTextField
                        fullWidth
                        label='Password'
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
                    </div>
                    <div className='flex flex-col w-full md:w-[48%]'>
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
                    </div>
                  </div>
                  <Button fullWidth variant='contained' type='submit'>
                    Create Employee
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateEmployee
