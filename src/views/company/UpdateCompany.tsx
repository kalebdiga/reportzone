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
import { IconButton } from '@mui/material'
import { X } from 'lucide-react'
const UpdateCompany = ({ data, handleClose }: { data: any; handleClose?: () => void }) => {
  // Hooks
  const router = useRouter()

  //(data, 'employee data')

  // Mutation Hook

  const postMutation = useDynamicMutation({ type: 'Json' })

  const onSubmit = async (values: { name: string }) => {
    //(data, 'data')
    if (!data?.id) return

    try {
      // Update profile details
      if (values.name !== data?.name) {
        postMutation.mutate({
          url: `/companies`,
          method: 'PATCH',
          body: {
            companyName: values.name,
            companyId: data?.id,
            status: null
          },
          invalidateKey: [['companyData']],

          onSuccess: data => {
            toast.dismiss()
            handleClose && handleClose()
          }
        })
      }

      // Redirect after successful updates
      // router.push('/company')
    } catch (err) {
      console.error('Error updating :', err)
      toast.error('Failed to update ')
    }
  }

  return (
    <div className='flex  justify-center'>
      <div className=' relative flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-1  md:!min-is-[unset] md:p-2 md:is-[480px] md:rounded-md'>
        <div className='flex flex-col gap-6 is-full  sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-0 sm:mbs-14 md:mbs-0 '>
          <Formik
            initialValues={{
              name: data?.name || ''
            }}
            onSubmit={onSubmit}
          >
            {() => (
              <Form className='space-y-5 w-full pb-4'>
                <FormikTextField name='name' label='Company Name' fullWidth />

                <Button fullWidth variant='contained' type='submit'>
                  Update Company
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default UpdateCompany
