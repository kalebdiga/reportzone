import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      accessToken: string
      globalRole: boolean
      role: string
      companyUser: CompanyUser[]
    }
  }

  interface User {
    id: string
    name: string
    email: string
    accessToken: string
    globalRole: boolean
    companyUser: CompanyUser[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    email: string
    accessToken: string
    globalRole: boolean
    companyUser: CompanyUser[]
  }
}

interface CompanyUser {
  id: string
  companyId: string
  userId: string
  isActive: boolean
  role: string
  createdAt: string
  updatedAt: string
}
