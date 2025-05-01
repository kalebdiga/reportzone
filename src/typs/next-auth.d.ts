// types/next-auth.d.ts or anywhere in your project
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      photo?: string
      phoneNumber?: string
      accessToken?: string
    }
  }

  interface User {
    id: string
    photo?: string
    phoneNumber?: string
    accessToken?: string
  }
}
