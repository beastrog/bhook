import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    const isAdmin = request.cookies.get('bhook_admin_auth')?.value === 'true';

    // Protect all /admin/* routes except /admin/login
    if (request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')) {
        if (!isAdmin) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    // If already logged in, redirect away from login
    if (request.nextUrl.pathname === '/admin/login' && isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
