'use client'

// React Imports

// Next Imports
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

// MUI Imports

import Button from '@mui/material/Button'

// Third-party Imports
import { Form, Formik } from 'formik'

// Component Imports
import FormikTextField from '@/lib/form/FormikInput'

// Hook Imports
import useDynamicMutation from '@/apihandeler/usePostData'

// Validation Schema

import FormikDropdown from '@/lib/form/FormikDropDown'
import { campaginSchema } from '@/schema/employeeschema'

const UpdateCampagin = ({ data, handleClose }: { data: any; handleClose?: () => void }) => {
  // Hooks
  const router = useRouter()

  //(data, 'admin data')

  // Mutation Hook

  const postMutation = useDynamicMutation({ type: 'Json' })

  const onSubmit = async (values: { budget: string; state: string }) => {
    if (!data?.id) return

    try {
      // Update profile details
      if (values.budget !== data?.budget || values.state !== data?.state) {
        postMutation.mutate({
          url: `/advertising/campaigns/${data?.id}`,
          method: 'PUT',
          body: {
            budget: Number(values.budget),
            state: values.state
          },
          invalidateKey: [['capaignData']],
          onSuccess: data => {
            toast.dismiss()
            handleClose && handleClose()
          }
        })
      }

      // Redirect after successful updates
      // router.push('/employees')
    } catch (err) {
      console.error('Error updating profile or role:', err)
      toast.error('Failed to update profile or role')
    }
  }

  return (
    <div className='flex  justify-center'>
      <div className=' relative flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-1  md:!min-is-[unset] md:p-2 md:is-[480px] md:rounded-md'>
        <div className='flex flex-col gap-6 is-full  sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-0 sm:mbs-14 md:mbs-0 '>
          <Formik
            initialValues={{
              budget: data?.campaignBudget || '',
              state: data?.campaignState || ''
            }}
            validationSchema={campaginSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form className='space-y-5 w-full pb-4'>
                <FormikTextField name='budget' label='Budget' fullWidth />
                {/* <FormikTextField name='state' label='State' fullWidth /> */}

                <FormikDropdown
                  name='state'
                  label='State'
                  options={[
                    { value: 'PAUSED', label: 'PAUSED' },
                    { value: 'ENABLED', label: 'ENABLED' }
                  ]}
                />

                <Button fullWidth variant='contained' type='submit'>
                  Update Campagin
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default UpdateCampagin
