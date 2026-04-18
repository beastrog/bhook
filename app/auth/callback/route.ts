import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/admin/dashboard'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user?.email) {
            const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
            if (adminEmails.length === 0 || adminEmails.includes(data.user.email)) {
                // Set our custom admin cookie for middleware consistency
                const cookieStore = await cookies();
                cookieStore.set('bhook_admin_auth', 'true', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30
                });
                return NextResponse.redirect(`${origin}${next}`)
            } else {
                // Not in whitelist
                await supabase.auth.signOut();
                return NextResponse.redirect(`${origin}/admin/login?error=Unauthorized_Email`)
            }
        }
    }

    return NextResponse.redirect(`${origin}/admin/login?error=Invalid_Link`)
}
