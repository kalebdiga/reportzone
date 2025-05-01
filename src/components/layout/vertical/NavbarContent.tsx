'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useSession } from 'next-auth/react'
import { useUserStore } from '@/lib/store/userProfileStore'
import { useFetchData } from '@/apihandeler/useFetchData'
import { useEffect } from 'react'

const NavbarContent = () => {
  const data = useSession()
  const { user, companyUsers, setUserData, setCompanyUsers } = useUserStore()

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

  console.log('AccessToken:', `Bearer ${data?.data?.user?.accessToken}`)
  console.log('User Store Data:', user, companyUsers)
  console.log('data', ProfileData, data?.data?.user?.accessToken)
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <h1 className=' text-[1rem] font-normal  hidden md:block'>
        welcome {user?.fname} {user?.lname}
      </h1>
      <div className='flex items-center justify-between gap-4 max-md:hidden'>
        <div className='flex items-center gap-4'>
          <NavToggle />
          <ModeDropdown />
        </div>
        <div className='flex items-center'>
          <UserDropdown />
        </div>
      </div>
      <div className='flex items-center gap-4 md:hidden'>
        <NavToggle />
        <ModeDropdown />
      </div>
      <div className='flex items-center md:hidden'>
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
