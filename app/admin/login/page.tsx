'use client';

import { useState } from 'react';
import { adminLogin } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

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
        <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative z-10">
            <div className="w-full max-w-sm">

                <div className="mb-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-6 border border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.15)]">
                        <Lock size={28} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight"><span className="italic pr-0.5">bhook.</span> admin</h1>
                    <p className="text-zinc-400 mt-2 font-medium">System authentication required</p>
                </div>

                <div className="glass-panel p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-bold text-zinc-300 block mb-2">System Email</label>
                                <input
                                    className="input-glass" type="email" placeholder="admin@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-zinc-300 block mb-2">Passcode</label>
                                <input
                                    className="input-glass" type="password" placeholder="••••••••"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
                            {loading ? 'Authenticating...' : 'Establish Connection'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
