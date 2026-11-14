import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const TONES = {
  info: { icon: CheckCircle2, cls: 'text-brand-300' },
  success: { icon: CheckCircle2, cls: 'text-success' },
  error: { icon: AlertTriangle, cls: 'text-danger' },
};

export default function Toast({ toast }) {
  const tone = TONES[toast?.tone] || TONES.info;
  const Icon = tone.icon;
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role="status"
          className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <div className="glass-strong flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl">
            <Icon className={`h-5 w-5 shrink-0 ${tone.cls}`} />
            <p className="text-sm font-semibold text-zinc-100">{toast.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
