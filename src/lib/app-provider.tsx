'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { type Session } from 'next-auth'

const queryClient = new QueryClient()
export default function AppProvider({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}): React.ReactNode {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  )
}
