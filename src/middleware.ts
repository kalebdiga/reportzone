import { NextResponse } from 'next/server'
import { auth, routes } from '../auth'

const protectedRoutes = ['/add-management']
const publicRoutes = ['/login']

export default auth(async (req: any) => {
  // console.log(JSON.stringify(auth()));

  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  console.log('object', !req.auth)
  console.log('isProtectedRoute', isProtectedRoute)
  console.log('isPublicRoute', isPublicRoute)

  if (isProtectedRoute && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isPublicRoute && req.auth) {
    return NextResponse.redirect(new URL(routes.home, req.nextUrl))
  } else {
    NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  if (req?.auth?.expires < Date.now()) {
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/add-management', '/', '/otp/verify', '/otp', '/login']
}
