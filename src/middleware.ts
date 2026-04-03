import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './utils/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Refresh session (Handles protection and redirects)
  const supabaseResponse = await updateSession(request);

  // 2. Handle internationalization
  // If we're visiting an admin or login or auth route, we SKIP intl middleware
  // to avoid it trying to add locale prefix and redirect to 404
  const isExcluded = pathname.startsWith('/admin') || 
                     pathname.startsWith('/login') || 
                     pathname.startsWith('/auth');

  if (isExcluded) {
    return supabaseResponse;
  }

  // Apply internationalization for user-facing pages
  return intlMiddleware(request);
}

export const config = {
  // Match localized pathnames AND admin/login roots
  matcher: [
    '/', 
    '/(ar|en)/:path*',
    '/admin/:path*',
    '/login',
    '/auth/:path*'
  ]
};
