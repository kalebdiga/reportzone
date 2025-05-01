import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const routes = {
  signIn: '/login',
  signOut: '/auth/signout',
  error: '/auth/error',
  forgotPassword: '/forgot-password',
  home: '/'
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt'
  },

  providers: [
    CredentialsProvider({
      id: 'login',
      credentials: {
        data: { label: 'data', type: 'text' } // declare the expected credential field
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥', JSON.stringify({ credentials }))

        try {
          const result = JSON.parse(credentials.data as string)
          console.log('🔥🔥😢😢😢🔥🔥 ', result)

          const user = {
            id: result.userId,
            name: 'Admin', // Assuming a default name since it's not in the data
            email: 'admin@example.com', // Assuming a default email since it's not in the data
            accessToken: result.token,
            globalRole: result.globalRole,
            companyUser: result.companyUser
          }

          return user
        } catch (error) {
          console.error('🛑 Error in authorize:', error)
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial login

      console.log('❤️❤️❤️❤️❤️', token)
      if (user) {
        return {
          ...token,
          ...user
        }
      }
      return token
    },

    async session({ session, token }) {
      // Send all user data to the session
      session.user = {
        id: token.id, // Updated to match the new structure
        name: token.name || 'Admin', // Default name if not provided
        email: token.email || 'admin@example.com', // Default email if not provided
        accessToken: token.accessToken,
        globalRole: token.globalRole,
        companyUser: token.companyUser,
        ...token
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
})
