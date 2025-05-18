'use client'

import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'
import { useSession } from 'next-auth/react'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useEffect } from 'react'

const Navbar = () => {
  const data = useSession()
  const { user, setUserData, setCompanyUsers } = useUserStore()

  const { data: ProfileData, isLoading } = useFetchData(
    ['profile', data?.data?.user?.accessToken],
    `/users/profile`,
    data?.data?.user?.accessToken ? { Authorization: `Bearer ${data?.data?.user?.accessToken}` } : {}
  )

  useEffect(() => {
    if (ProfileData?.user && ProfileData?.companyUsers) {
      setUserData(ProfileData.user)
      setCompanyUsers(ProfileData.companyUsers)
    }
  }, [ProfileData, setUserData, setCompanyUsers, isLoading])

  return (
    <LayoutNavbar>
      <NavbarContent />
    </LayoutNavbar>
  )
}

export default Navbar
