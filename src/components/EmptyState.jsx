import { motion } from 'framer-motion';

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-10 text-center"
    >
      <div className="relative mb-6 h-32 w-32">
        <motion.div
          className="absolute inset-0 rounded-full bg-brand/20 blur-2xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.svg
          viewBox="0 0 128 128"
          className="relative h-full w-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <rect x="22" y="30" width="84" height="58" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" />
          <rect x="34" y="44" width="60" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
          <rect x="34" y="56" width="44" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
          <rect x="34" y="68" width="30" height="6" rx="3" fill="rgba(139,92,246,0.7)" />
          <circle cx="96" cy="28" r="12" fill="#8B5CF6" />
          <path d="M91 28h10M96 23v10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </motion.svg>
      </div>
      <h3 className="text-lg font-extrabold text-zinc-100">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
