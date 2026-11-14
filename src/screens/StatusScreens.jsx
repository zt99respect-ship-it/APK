import { motion } from 'framer-motion';
import { LogOut, Lock, ShieldOff, Wrench } from 'lucide-react';
import { Button } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';
import { signOutUser } from '../services/auth.js';

const LOGO_SRC = '/Picsart_26-11-14_11-07-40-109.jpg';

export function CenteredShell({ children }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="glass relative w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8"
      >
        {children}
      </motion.div>
    </div>
  );
}

function StatusCard({ icon: Icon, title, description, action }) {
  return (
    <CenteredShell>
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <Icon className="h-8 w-8 text-zinc-200" />
        </div>
        <h1 className="text-xl font-extrabold text-zinc-50">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>
        {action && <div className="mt-6 w-full">{action}</div>}
      </div>
    </CenteredShell>
  );
}

export function SplashScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <motion.img
        src={LOGO_SRC}
        alt="RESPECT"
        className="h-24 w-24 rounded-3xl object-cover shadow-2xl shadow-brand/30"
        animate={{ scale: [0.96, 1.02, 0.96], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export function BannedScreen() {
  const { signOut } = useApp();
  return (
    <StatusCard
      icon={ShieldOff}
      title="تم إيقاف حسابك"
      description="تم حظر حسابك من مجتمع ريسبكت. إذا كنت تعتقد أن هذا خطأ، تواصل مع الإدارة."
      action={
        <Button variant="glass" onClick={signOut} className="w-full">
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      }
    />
  );
}

export function MaintenanceScreen() {
  const { signOut } = useApp();
  return (
    <StatusCard
      icon={Wrench}
      title="التطبيق تحت الصيانة"
      description="نعمل حالياً على تحسين التطبيق. سنعود قريباً، شكراً لصبرك."
      action={
        <Button variant="glass" onClick={signOut} className="w-full">
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      }
    />
  );
}

export function ProfileErrorScreen() {
  return (
    <StatusCard
      icon={Lock}
      title="تعذر تحميل الحساب"
      description="لم نتمكن من تحميل بيانات حسابك. تحقق من اتصالك وأعد تحميل الصفحة."
      action={
        <Button variant="glass" onClick={() => signOutUser()} className="w-full">
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      }
    />
  );
}
