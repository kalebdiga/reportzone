'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { doLogout } from '@/utils/actions'
import { useSession } from 'next-auth/react'
import { useUserStore } from '@/lib/store/userProfileStore'
import UpdateProfile from '@/views/profile/UpdateProfile'
import UpdatePassword from '@/views/profile/UpdatePassword'
import DialogComponent from './DialogsSizes'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [OpenEmplyeeProfile, setOpenEmplyeeProfile] = useState(false)
  const [OpenEmplyeePassword, setOpenEmplyeePassword] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const { user, companyUsers } = useUserStore()
  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    // Redirect to login page
    doLogout()
  }
  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt='John Doe'
          src={''}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar alt='John Doe' src={''} />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {user?.fname ?? 'John'} {user?.lname ?? 'Doe'}
                      </Typography>
                      <Typography variant='caption'>{user?.email}</Typography>
                      <Typography variant='caption'>
                        {user?.globalRole === true ? 'Super Admin' : companyUsers?.[0]?.role}
                      </Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={() => setOpenEmplyeeProfile(true)}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>Update Profile</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={() => setOpenEmplyeePassword(true)}>
                    <i className='tabler-lock-password' />
                    <Typography color='text.primary'>Change Password</Typography>
                  </MenuItem>

                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
      <DialogComponent
        open={OpenEmplyeeProfile}
        handleClose={() => setOpenEmplyeeProfile(false)}
        data={user}
        title='Update Profile'
      >
        {({ data, handleClose }: { data: any; handleClose?: () => void }) => (
          <UpdateProfile handleClose={handleClose} data={data} />
        )}
      </DialogComponent>
      <DialogComponent
        open={OpenEmplyeePassword}
        handleClose={() => setOpenEmplyeePassword(false)}
        title='Update Password'
      >
        {({ handleClose }: { data: any; handleClose?: () => void }) => <UpdatePassword handleClose={handleClose} />}
      </DialogComponent>
    </>
  )
}

export default UserDropdown
