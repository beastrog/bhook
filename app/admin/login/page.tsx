'use client';

import { useState } from 'react';
import { Loader2, Lock, Mail } from 'lucide-react';
import { adminLogin } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Fill all fields'); return; }
        setLoading(true);
        const { error } = await adminLogin(email, password);
        setLoading(false);
        if (error) { toast.error(error); return; }
        router.replace('/admin/dashboard');
    };

    return (
        <div className="min-h-dvh flex items-center justify-center px-5" style={{ background: 'var(--bg)' }}>
            <div className="w-full max-w-xs">
                {/* Brand */}
                <div className="mb-8">
                    <p className="font-black text-2xl mb-1" style={{ letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
                        bhook<span style={{ color: 'var(--accent)' }}>.</span>
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Admin access</p>
                </div>

                <form onSubmit={handleLogin} className="card p-5 space-y-3" style={{ borderRadius: '16px' }}>
                    <div>
                        <label className="text-label mb-2 block flex items-center gap-1.5"><Mail size={10} /> Email</label>
                        <input className="input" type="email" placeholder="admin@bhook.in"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-label mb-2 block flex items-center gap-1.5"><Lock size={10} /> Password</label>
                        <input className="input" type="password" placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading}
                        className="btn btn-orange w-full py-3 mt-1" style={{ borderRadius: '10px', width: '100%', justifyContent: 'center' }}>
                        {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : 'Sign In →'}
                    </button>
                </form>

                <p className="text-xs text-center mt-4" style={{ color: 'var(--text-tertiary)' }}>
                    <a href="/" style={{ color: 'var(--text-secondary)' }}>← Back to store</a>
                </p>
            </div>
        </div>
    );
}
