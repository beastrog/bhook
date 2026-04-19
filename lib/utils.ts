import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
    const n = Number(amount);
    if (!isFinite(n)) return '₹0';
    return `₹${n.toFixed(0)}`;
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
    });
}

export function formatDateShort(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Kolkata',
    });
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'reserved': return 'text-violet-400 bg-violet-400/10';
        case 'pending_pickup': return 'text-amber-400 bg-amber-400/10';
        case 'completed': return 'text-emerald-400 bg-emerald-400/10';
        case 'cancelled': return 'text-red-400 bg-red-400/10';
        default: return 'text-gray-400 bg-gray-400/10';
    }
}

export function getStatusLabel(status: string): string {
    switch (status) {
        case 'reserved': return 'Reserved';
        case 'pending_pickup': return 'Pending Pickup';
        case 'completed': return 'Completed';
        case 'cancelled': return 'Cancelled';
        default: return status;
    }
}

export function getStockBadge(stock: number) {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-400 bg-red-400/10' };
    if (stock <= 3) return { label: `Only ${stock} left!`, color: 'text-orange-400 bg-orange-400/10' };
    if (stock <= 10) return { label: `${stock} left`, color: 'text-amber-400 bg-amber-400/10' };
    return { label: `${stock} in stock`, color: 'text-emerald-400 bg-emerald-400/10' };
}

export function todayDateRange(): { start: string; end: string } {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return {
        start: start.toISOString(),
        end: end.toISOString(),
    };
}
