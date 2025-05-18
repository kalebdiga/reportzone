// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { Toaster } from 'sonner'
import { ToastContainer } from 'react-toastify'
import QueryProvider from '@/providers/QueryProvider'
import { auth } from '../../auth'
import SessionDataProviders from '@/providers/SessionDataProviders'
import AppProvider from '@/lib/app-provider'
import Customizer from '@/@core/components/customizer'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Report Zone ',
  description: ''
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Vars

  const systemMode = await getSystemMode()
  const direction = 'ltr'
  const session = await auth()
  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers direction={direction}>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          {/* <Toaster position='top-right' visibleToasts={1} /> */}
          <ToastContainer position='bottom-right' limit={1} newestOnTop autoClose={3000} />
          <AppProvider session={session}>{children}</AppProvider>

          <Customizer dir={direction} />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
