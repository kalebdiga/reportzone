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
          console.log('🔥🔥😢😢😢🔥🔥 ', result?.data?.user)

          return {
            id: result?.data?.user?._id,
            name: result?.data?.user?.name,
            email: result?.data?.user?.email,
            accessToken: result?.token,
            ...result?.data?.user
          }
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
        id: token._id,
        name: token.name,
        email: token.email,
        phoneNumber: token.phoneNumber,
        accessToken: token.accessToken,
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
