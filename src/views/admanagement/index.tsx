'use client'

import React, { useEffect } from 'react'
import Tabs from './Tabs'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useSession } from 'next-auth/react'

export default function AdManagement() {
  const { data: session, status } = useSession()
  const { user, setUserData, setCompanyUsers } = useUserStore()
  const accessToken = session?.user?.accessToken
  const shouldFetch = status === 'authenticated' && !!accessToken

  const { data: ProfileData, isLoading } = useFetchData(
    shouldFetch ? ['profile', accessToken] : [],
    `/users/profile`,
    shouldFetch ? { Authorization: `Bearer ${accessToken}` } : {}
  )

  useEffect(() => {
    if (ProfileData?.user && ProfileData?.companyUsers) {
      setUserData(ProfileData.user)
      setCompanyUsers(ProfileData.companyUsers)
    }
  }, [ProfileData, setUserData, setCompanyUsers, isLoading])

  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>You are not signed in</p>
  return <Tabs />
}
