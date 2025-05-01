/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'

import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosProgressEvent } from 'axios'
import { useGetHeaders } from '@/hooks/use-get-headers'

type MutationOptions = {
  url: string
  method: AxiosRequestConfig['method']
  body?: any
  headers?: AxiosRequestConfig['headers']
  onSuccess?: (data: AxiosResponse['data']) => void
  onError?: (error: any) => void
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
}

// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response.status === 403 || error.response.status === 401) {
//       // signOut()
//     }

//     return Promise.reject(error)
//   }
// )

const useDynamicMutation = ({ type = 'Json' }: { type?: 'FormData' | 'Json' }) => {
  const header = useGetHeaders({ type })

  const dynamicMutation = useMutation({
    mutationFn: async (options: MutationOptions) => {
      const { url, method, body, headers, onUploadProgress, onDownloadProgress } = options

      try {
        const response = await axios.request({
          url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
          method,
          headers: headers || header,
          data: body,
          onUploadProgress,
          onDownloadProgress
        })

        return response.data
      } catch (error) {
        throw error
      }
    },

    onSuccess: (data, variables) => {
      console.log(data, variables)

      if (variables.onSuccess) {
        variables.onSuccess(data)
      }
    },

    onError: (error, variables) => {
      if (variables.onError) {
        variables.onError(error)
      }

      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.response?.data?.error
      const isString = typeof errorMessage === 'string'

      toast.error(isString ? errorMessage : 'Something went wrong')
    },

    retry: false
  })

  return dynamicMutation
}

export default useDynamicMutation
