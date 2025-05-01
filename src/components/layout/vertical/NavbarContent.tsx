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

const NavbarContent = () => {
  const data = useSession()

  console.log('data', data)
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <h1 className=' text-[1rem] font-normal  hidden md:block'>welcome {data.data?.user?.name}</h1>
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
