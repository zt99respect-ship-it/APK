import { motion } from 'framer-motion';
import { Radio, Users, UserRound } from 'lucide-react';

export const TABS = [
  { id: 'streams', label: 'البثوث', icon: Radio },
  { id: 'community', label: 'المجتمع', icon: Users },
  { id: 'profile', label: 'حسابي', icon: UserRound },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="glass-strong fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg rounded-t-3xl px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2">
      <ul className="grid grid-cols-3 gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex w-full flex-col items-center gap-1 rounded-2xl py-2 transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 rounded-2xl bg-brand/15 ring-1 ring-brand/40"
                    transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                  />
                )}
                <Icon className={`relative h-6 w-6 transition-colors ${isActive ? 'text-brand' : 'text-zinc-400'}`} />
                <span className={`relative text-[11px] font-bold ${isActive ? 'text-zinc-50' : 'text-zinc-400'}`}>
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
