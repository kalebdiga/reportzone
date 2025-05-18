/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { toast } from 'react-toastify'
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import axios from 'axios'
import { type AxiosRequestConfig, type AxiosResponse, type AxiosProgressEvent } from 'axios'
import { useGetHeaders } from '@/hooks/use-get-headers'

type MutationOptions = {
  url: string
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  headers?: AxiosRequestConfig['headers']
  onSuccess?: (data: AxiosResponse['data']) => void
  onError?: (error: any) => void
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  invalidateKey?: QueryKey | QueryKey[]
}

const useDynamicMutation = ({ type = 'Json' }: { type?: 'FormData' | 'Json' }) => {
  const queryClient = useQueryClient()
  const defaultHeaders = useGetHeaders({ type })

  return useMutation({
    mutationFn: async (options: MutationOptions) => {
      const { url, method, body, headers, onUploadProgress, onDownloadProgress } = options

      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        method,
        headers: headers || defaultHeaders,
        data: body,
        onUploadProgress,
        onDownloadProgress
      }

      const response = await axios.request(config)
      return response.data
    },

    onSuccess: (data, variables) => {
      if (variables.onSuccess) {
        variables.onSuccess(data)
      }

      const invalidate = (key: QueryKey) => {
        //('🟡 Invalidating key:', key)

        // Debug current cache
        const allKeys = queryClient
          .getQueryCache()
          .getAll()
          .map(q => q.queryKey)

        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: key, exact: false })
        queryClient.refetchQueries({ queryKey: key, exact: false })
      }

      if (variables.invalidateKey) {
        if (Array.isArray(variables.invalidateKey)) {
          variables.invalidateKey.forEach(invalidate)
        } else {
          invalidate(variables.invalidateKey)
        }
      }
    },

    onError: (error, variables) => {
      if (variables.onError) {
        variables.onError(error)
      }

      const message =
        (error as any)?.response?.data?.message || (error as any)?.response?.data?.error || 'Something went wrong'

      toast.dismiss()
      toast.error(typeof message === 'string' ? message : 'Something went wrong')
    },

    retry: false
  })
}

export default useDynamicMutation
