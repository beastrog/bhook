'use client';

import { useState } from 'react';
import { adminLoginOTP } from '@/app/admin/actions';
import { toast } from 'sonner';
import { ShieldCheck, ArrowRight, Loader2, MailCheck } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { toast.error('Email required'); return; }
        setLoading(true);
        const redirectUrl = `${window.location.origin}/auth/callback?next=/admin/dashboard`;
        const { error } = await adminLoginOTP(email.trim(), redirectUrl);
        setLoading(false);
        if (error) { toast.error(error); return; }
        setSent(true);
    };

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-5 bg-deep">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-lime/8 text-lime">
                        {sent ? <MailCheck size={28} /> : <ShieldCheck size={28} />}
                    </div>
                    <h1 className="font-display font-bold text-2xl tracking-tight mb-1">
                        {sent ? 'Check your email' : 'Admin Login'}
                    </h1>
                    <p className="text-sm text-t3">
                        {sent ? 'We sent a magic link to your email. Click it to log in.' : 'Verify your email to access the dashboard.'}
                    </p>
                </div>

                {!sent && (
                    <div className="bg-card border border-bdr rounded-2xl p-6">
                        <form onSubmit={handleSendLink} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-2">Admin Email</label>
                                <input className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none placeholder:text-t3 focus:border-lime/40 transition-colors"
                                    type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-lime text-deep font-extrabold py-3.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40">
                                {loading ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <>Send Magic Link <ArrowRight size={15} /></>}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
