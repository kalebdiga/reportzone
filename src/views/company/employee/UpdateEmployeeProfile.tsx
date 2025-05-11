'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { Form, Formik } from 'formik'

// Component Imports
import FormikTextField from '@/lib/form/FormikInput'

// Hook Imports
import useDynamicMutation from '@/apihandeler/usePostData'

// Validation Schema

import { type UserData } from '@/typs/user.type'
import FormikDropdown from '@/lib/form/FormikDropDown'
import { profileSchema } from '@/schema/employeeschema'
import { IconButton } from '@mui/material'
import { X } from 'lucide-react'
const UpdateEmployeeProfile = ({ data, handleClose }: { data: UserData; handleClose?: () => void }) => {
  // Hooks
  const router = useRouter()

  console.log(data, 'employee data')

  // Mutation Hook

  const postMutation = useDynamicMutation({ type: 'Json' })

  const onSubmit = async (values: {
    fname: string
    lname: string
    email: string
    account_status: string | null
    role: string
  }) => {
    if (!data?.user?.id) return

    try {
      // Update profile details
      if (
        values.fname !== data?.user?.fname ||
        values.lname !== data?.user?.lname ||
        values.email !== data?.user?.email
      ) {
        postMutation.mutate({
          url: `/users/${data?.user?.id}`,
          method: 'PATCH',
          body: {
            fname: values.fname,
            lname: values.lname,
            email: values.email,
            account_status: values.account_status
          },
          invalidateKey: ['CompanyEmployees'],
          onSuccess: data => {
            toast.dismiss()
            toast.success('Profile updated successfully')
            handleClose && handleClose()
          }
        })
      }

      // Check if the role has changed
      if (values.role !== data?.companyUsers[0]?.role) {
        // Update role
        postMutation.mutate({
          url: `/users/${data?.companyUsers?.[0].id}/role`,
          method: 'PATCH',
          body: {
            userId: data?.user?.id,
            role: values.role
          },
          invalidateKey: ['employeeData'],

          onSuccess: data => {
            toast.dismiss()
            toast.success('Role updated successfully')
            handleClose && handleClose()
          }
        })
      }

      // Redirect after successful updates
      // router.push('/employees')
    } catch (err) {
      console.error('Error updating profile or role:', err)
      toast.dismiss()
      toast.error('Failed to update profile or role')
    }
  }

  return (
    <div className='flex  justify-center'>
      <div className=' relative flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-1  md:!min-is-[unset] md:p-2 md:is-[480px] md:rounded-md'>
        <div className='flex flex-col gap-6 is-full  sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-0 sm:mbs-14 md:mbs-0 '>
          <Formik
            initialValues={{
              fname: data?.user?.fname || '',
              lname: data?.user?.lname || '',
              email: data?.user?.email || '',
              account_status: null,
              role: data?.companyUsers[0]?.role || ''
            }}
            validationSchema={profileSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form className='space-y-5 w-full pb-4'>
                <FormikTextField name='fname' label='First Name' fullWidth />
                <FormikTextField name='lname' label='Last Name' fullWidth />
                <FormikTextField name='email' label='Email' fullWidth />
                <FormikDropdown
                  name='role'
                  label='Role'
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'employee', label: 'User' }
                  ]}
                />{' '}
                <Button fullWidth variant='contained' type='submit'>
                  Update Profile
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default UpdateEmployeeProfile
