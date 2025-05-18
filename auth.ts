// app/auth.ts (or lib/auth.ts)
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

export const routes = {
  signIn: '/login',
  signOut: '/auth/signout',
  error: '/auth/error',
  forgotPassword: '/forgot-password',
  home: '/add-management/addprofile'
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt'
  },

  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Custom Login',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
        token: { label: 'Token', type: 'text' },
        globalRole: { label: 'Global Role', type: 'text' },
        companyUser: { label: 'Company User', type: 'text' }
      },
      async authorize(credentials: Partial<Record<'userId' | 'token' | 'globalRole' | 'companyUser', unknown>>) {
        const userId = credentials?.userId as string | undefined
        const token = credentials?.token as string | undefined
        const globalRole = credentials?.globalRole as string | boolean | undefined
        const companyUserRaw = credentials?.companyUser as string | undefined

        if (!userId || !token) return null

        try {
          const user = {
            id: userId, // ✅ explicitly a string
            name: 'Admin',
            email: 'admin@example.com',
            accessToken: token,
            globalRole: globalRole === 'true' || globalRole === true,
            companyUser: companyUserRaw ? JSON.parse(companyUserRaw) : []
          }

          //('🔥🔥🔥🔥🔥🔥🔥🔥', user)
          return user as any // ✅ or cast to `as User` if you've extended the type
        } catch (err) {
          console.error('❌ Failed to parse companyUser:', err)
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.accessToken = user.accessToken
        token.globalRole = user.globalRole
        token.companyUser = user.companyUser
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        accessToken: token.accessToken as string,
        globalRole: token.globalRole as boolean,
        role: token.globalRole ? 'superadmin' : (token.companyUser as any)?.[0]?.role,
        companyUser: token.companyUser
      } as any
      return session
    },

    authorized: async ({ auth }) => {
      return !!auth
    },

    async redirect({ url, baseUrl }) {
      const parsedUrl = new URL(url, baseUrl)
      if (parsedUrl.searchParams.has('callbackUrl')) {
        return `${baseUrl}${parsedUrl.searchParams.get('callbackUrl')}`
      }
      return parsedUrl.origin === baseUrl ? url : baseUrl
    }
  },

  pages: {
    signIn: routes.signIn,
    signOut: routes.signOut,
    error: routes.error
  }
} satisfies NextAuthConfig)
