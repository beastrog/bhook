'use client';

import { useState } from 'react';
import { adminLoginOTP, adminVerifyOTP } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { toast.error('Email required'); return; }
        setLoading(true);
        const { error } = await adminLoginOTP(email);
        setLoading(false);
        if (error) { toast.error(error); return; }
        toast.success('Verification code sent');
        setStep('OTP');
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) { toast.error('Code required'); return; }
        setLoading(true);
        const { error } = await adminVerifyOTP(email, otp);
        setLoading(false);
        if (error) { toast.error(error); return; }
        router.replace('/admin/dashboard');
    };

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative z-10">
            <div className="w-full max-w-md">

                <div className="mb-12 text-center">
                    <div className="w-20 h-20 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-2xl">
                        <ShieldAlert size={32} className="text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-3">System Access</h1>
                    <p className="text-zinc-500 font-medium">Verify your identity to command the vault.</p>
                </div>

                <div className="structural-panel p-8 md:p-10">
                    {step === 'EMAIL' ? (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 tracking-widest uppercase block mb-3">Administrator Email</label>
                                <input
                                    className="input-minimal" type="email" placeholder="sysadmin@bhook.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary w-full shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                                {loading ? 'Transmitting...' : 'Request Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 tracking-widest uppercase block mb-3">6-Digit OTP</label>
                                <input
                                    className="input-minimal tracking-[1em] text-center text-xl font-mono"
                                    type="text" maxLength={6} placeholder="000000"
                                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary w-full shadow-[0_10px_30px_rgba(255,255,255,0.1)] gap-3">
                                {loading ? 'Verifying...' : 'Establish Uplink'} <ArrowRight size={18} strokeWidth={2.5} />
                            </button>
                            <div className="text-center">
                                <button type="button" onClick={() => setStep('EMAIL')} className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-bold">
                                    Use different email
                                </button>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}
