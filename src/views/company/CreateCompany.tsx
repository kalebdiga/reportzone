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

// Hook Imports
import useDynamicMutation from '@/apihandeler/usePostData'

// Validation Schema
import IconButton from '@mui/material/IconButton'

// Lucide React Imports
import { X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CreateCompany = ({ id, handleClose }: { id: any; handleClose?: () => void }) => {
  // Hooks
  const { data } = useSession()
  const router = useRouter()

  // Mutation Hook
  const postMutation = useDynamicMutation({ type: 'Json' })

  // Validation Schema

  const onSubmit = (values: { name: string }, { resetForm }: { resetForm: () => void }) => {
    try {
      postMutation.mutate({
        url: '/companies',
        method: 'POST',
        body: {
          name: values.name
        },
        invalidateKey: ['companyData'],
        onSuccess: data => {
          toast.success('Company created successfully')
          resetForm()
          handleClose?.()
          !handleClose && router.push('/employees')
        }
      })
    } catch (err) {
      console.error('Error creating employee:', err)
      toast.error('Failed to create company')
    }
  }

  return (
    <>
      <div className='p-1'>
        <div className='flex justify-center max-md:h-[70svh] max-md:overflow-y-auto bg-backgroundPaper md:is-[400px]'>
          <div className='relative flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[400px] md:rounded-md'>
            {/* Close Icon */}
            {handleClose && (
              <div className='absolute top-2 right-2'>
                <IconButton onClick={handleClose} aria-label='Close'>
                  <X size={20} />
                </IconButton>
              </div>
            )}

            <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
              <div className='flex flex-col gap-1'>
                <Typography variant='h4'>Create Company</Typography>
                <Typography>Fill in the details below to create a new Company</Typography>
              </div>
              <Formik
                initialValues={{
                  name: ''
                }}
                onSubmit={onSubmit}
              >
                {() => (
                  <Form className='space-y-5 w-full pb-4'>
                    <div className='flex flex-wrap gap-4'>
                      <div className='flex flex-col w-full md:w-[100%]'>
                        <FormikTextField name='name' label='Company Name' fullWidth />
                      </div>
                    </div>
                    <Button fullWidth variant='contained' type='submit'>
                      Create Company
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateCompany
