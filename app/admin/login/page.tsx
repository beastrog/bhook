'use client';

import { useState, useEffect, Suspense } from 'react';
import { adminLoginEmail } from '@/app/admin/actions';
import { toast } from 'sonner';
import { ShieldCheck, ArrowRight, Loader2, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'Unauthorized_Email') toast.error('This email is not on the admin whitelist.');
        if (error === 'Invalid_Link') toast.error('The login link was invalid or expired.');
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { toast.error('Email required'); return; }
        setLoading(true);
        const res = await adminLoginEmail(email.trim());
        if (res.error) {
            toast.error(res.error);
            setLoading(false);
            return;
        }
        setSent(true);
        setLoading(false);
        toast.success('Magic link sent! Check your inbox.');
    };

    if (sent) {
        return (
            <div className="w-full max-w-sm text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-lime/10 text-lime animate-bounce">
                    <Mail size={32} />
                </div>
                <h1 className="font-display font-bold text-2xl tracking-tight mb-3">Check your email</h1>
                <p className="text-sm text-t3 leading-relaxed mb-8 text-balance">
                    We've sent a secure login link to <span className="text-t1 font-bold">{email}</span>. Click the link in the email to access the dashboard.
                </p>
                <button onClick={() => setSent(false)} className="text-xs font-bold text-lime hover:underline">
                    Back to login
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-lime/8 text-lime">
                    <ShieldCheck size={28} />
                </div>
                <h1 className="font-display font-bold text-2xl tracking-tight mb-1">
                    Admin Portal
                </h1>
                <p className="text-sm text-t3">
                    Secure access for authorized personnel only.
                </p>
            </div>

            <div className="space-y-4">
                <div className="bg-card border border-bdr rounded-2xl p-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-2">Admin Email</label>
                            <input className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none placeholder:text-t3 focus:border-lime/40 transition-colors"
                                type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-lime text-[#000000] font-extrabold py-3.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40">
                            {loading ? <Loader2 size={15} className="animate-spin" /> : <>Send Magic Link <ArrowRight size={15} /></>}
                        </button>
                    </form>
                </div>

                <p className="text-[10px] text-center text-t3 leading-relaxed px-4">
                    By logging in, you agree to handle all customer data securely and maintain the operational integrity of BHOOKH.
                </p>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-5 bg-deep">
            <Suspense fallback={<Loader2 className="animate-spin text-lime" />}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
