// middleware.ts
import { auth } from '../auth'
import { NextResponse } from 'next/server'

const protectedRoutes = [
  '/add-management/addprofile',
  '/companies',
  '/add-management/campagines',
  '/seller-accounts',
  '/logs',
  '/employees'
]
const publicRoutes = ['/login']

export default auth(req => {
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.includes(pathname)
  const isPublic = publicRoutes.includes(pathname)
  const isAuthed = !!req.auth

  // If accessing protected route but not authenticated
  if (isProtected && !isAuthed) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // If accessing login while authenticated
  if (isPublic && isAuthed) {
    return NextResponse.redirect(new URL('/add-management/addprofile', req.nextUrl))
  }

  // Allow all other routes
  return NextResponse.next()
})
export const config = {
  matcher: [
    '/login',
    '/add-management/addprofile',
    '/add-management/addprofile/(.*)',
    '/companies',
    '/companies/(.*)',
    '/add-management/campagines',
    '/add-management/campagines/(.*)',
    '/seller-accounts',
    '/seller-accounts/(.*)',
    '/employees',
    '/employees/(.*)'
  ]
}
