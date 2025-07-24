import { stackServerApp } from './stack'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Don't protect the sign-in page or root page
  if (
    request.nextUrl.pathname === '/handler/sign-in' ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next()
  }

  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/handler/sign-in', request.url))
    }
    return NextResponse.next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.redirect(new URL('/handler/sign-in', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/profile/:path*',
    '/handler/sign-in',
    '/',
  ],
}
