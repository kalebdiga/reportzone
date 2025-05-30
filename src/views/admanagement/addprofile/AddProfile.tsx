'use client'
import React from 'react'
import AdsTable from './AdsTable'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useSession } from 'next-auth/react'

function AddProfile() {
  const { companyUsers } = useUserStore()
  const data = useSession()

  const { data: addProfileData, isLoading } = useFetchData(
    ['addProfileData', data?.data?.user?.accessToken, companyUsers[0]?.companyId],
    `/advertising/profiles`
  )

  //('new profile data', addProfileData?.profiles)

  return <AdsTable />
}

export default AddProfile
