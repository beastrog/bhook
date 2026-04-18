'use client';

import { useState } from 'react';
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
        <div className="min-h-dvh bg-black flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm">

                <h1 className="title-medium mb-1">bhook<span className="text-[var(--accent)]">.</span></h1>
                <p className="text-sm text-[var(--text-secondary)] mb-12">Authorized Personnel Only</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-overline mb-2">Email</p>
                            <input
                                className="input" type="email" placeholder="admin@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <p className="text-overline mb-2">Password</p>
                            <input
                                className="input" type="password" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-secondary w-full mt-4 bg-white text-black font-black uppercase text-sm tracking-wider">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

            </div>
        </div>
    );
}
