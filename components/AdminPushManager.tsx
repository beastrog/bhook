'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { subscribeAdmin, unsubscribeAdmin, checkSubscription } from '@/app/admin/actions';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export default function AdminPushManager() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
            setPermission(Notification.permission);
            checkCurrentSubscription();
        } else {
            setLoading(false);
        }
    }, []);

    const checkCurrentSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('Check subscription error:', error);
        } finally {
            setLoading(false);
        }
    };

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const handleSubscribe = async () => {
        if (!VAPID_PUBLIC_KEY) {
            toast.error('VAPID Public Key not found');
            return;
        }

        setLoading(true);
        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result !== 'granted') {
                toast.error('Notifications permission denied');
                setLoading(false);
                return;
            }

            const registration = await navigator.serviceWorker.register('/sw.js');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            const { error } = await subscribeAdmin(JSON.parse(JSON.stringify(subscription)));
            if (error) throw new Error(error);

            setIsSubscribed(true);
            toast.success('Subscribed to notifications!');
        } catch (error: any) {
            console.error('Subscription error:', error);
            toast.error(error.message || 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                await unsubscribeAdmin(subscription.endpoint);
            }
            setIsSubscribed(false);
            toast.success('Unsubscribed from notifications');
        } catch (error: any) {
            console.error('Unsubscribe error:', error);
            toast.error(error.message || 'Failed to unsubscribe');
        } finally {
            setLoading(false);
        }
    };

    if (permission === 'denied') {
        return (
            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-err text-[10px] font-bold">
                    <BellOff size={14} /> Alerts Blocked
                </div>
                <p className="text-[8px] text-t3 leading-tight text-right max-w-[120px]">
                    Reset permission in your browser address bar to enable.
                </p>
            </div>
        );
    }

    return (
        <button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 disabled:opacity-50 ${isSubscribed
                    ? 'bg-ok/10 text-ok border border-ok/20 hover:bg-ok/20'
                    : 'bg-lime text-black border border-lime hover:shadow-[0_0_12px_rgba(200,255,0,0.4)]'
                }`}
        >
            {loading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : isSubscribed ? (
                <Bell size={14} className="animate-pulse" />
            ) : (
                <BellOff size={14} />
            )}
            <span className="hidden sm:inline">
                {isSubscribed ? 'Alerts Active' : 'Enable Alerts'}
            </span>
            <span className="sm:hidden font-extrabold uppercase tracking-tighter">
                {isSubscribed ? 'ON' : 'ALERTS'}
            </span>
        </button>
    );
}
