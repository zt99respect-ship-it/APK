import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-600 active:scale-[0.98] disabled:bg-brand/40',
  glass:
    'glass text-zinc-100 hover:bg-white/10 active:scale-[0.98] disabled:text-zinc-500',
  danger:
    'bg-danger/15 text-rose-300 border border-danger/30 hover:bg-danger/25 active:scale-[0.98] disabled:opacity-50',
};

export const Button = forwardRef(function Button(
  { variant = 'primary', loading = false, className = '', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={loading || props.disabled}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export function IconButton({ label, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-200 transition-colors hover:bg-white/10 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Avatar({ src, name = '', className = 'h-10 w-10' }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        className={`${className} shrink-0 rounded-full object-cover ring-1 ring-white/10`}
      />
    );
  }
  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-extrabold text-zinc-300 ring-1 ring-white/10`}
    >
      {initial}
    </div>
  );
}

export function Spinner({ className = '' }) {
  return <Loader2 className={`h-5 w-5 animate-spin text-zinc-400 ${className}`} />;
}

export const ROLE_LABELS = {
  admin: 'مدير',
  moderator: 'مشرف',
};

export function RoleBadge({ role }) {
  const label = ROLE_LABELS[role];
  if (!label) return null;
  return (
    <span className="rounded-full border border-brand/40 bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand-300">
      {label}
    </span>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-live px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      LIVE
    </span>
  );
}
