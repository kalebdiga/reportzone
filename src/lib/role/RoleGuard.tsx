// components/RoleGuard.tsx
import { useSession } from 'next-auth/react'
import React from 'react'

type Props = {
  allowedRoles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function RoleGuard({ allowedRoles, children, fallback = null }: Props) {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  if (session && allowedRoles.includes((session?.user as any)?.role)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
