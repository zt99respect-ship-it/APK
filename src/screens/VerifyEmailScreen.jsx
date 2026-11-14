import { useState } from 'react';
import { MailCheck, LogOut } from 'lucide-react';
import { Button } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';
import { resendVerification } from '../services/auth.js';
import { CenteredShell } from './StatusScreens.jsx';

export default function VerifyEmailScreen() {
  const { authUser, notify, refreshVerification, signOut } = useApp();
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);

  const handleCheck = async () => {
    setChecking(true);
    try {
      await refreshVerification();
      if (!authUser?.emailVerified) notify('لم يتم تأكيد البريد بعد', 'error');
    } catch {
      notify('تعذر التحقق، حاول مرة أخرى', 'error');
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      notify('تم إرسال رابط التأكيد إلى بريدك', 'success');
    } catch {
      notify('انتظر قليلاً قبل إعادة الإرسال', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <CenteredShell>
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 ring-1 ring-brand/40">
          <MailCheck className="h-8 w-8 text-brand-300" />
        </div>
        <h1 className="text-xl font-extrabold text-zinc-50">أكّد بريدك الإلكتروني</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          أرسلنا رابط التأكيد إلى
        </p>
        <p dir="ltr" className="mt-1 break-all text-sm font-bold text-zinc-100">
          {authUser?.email}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          افتح الرسالة واضغط على الرابط، ثم ارجع واضغط زر التحقق.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <Button onClick={handleCheck} loading={checking} className="w-full">
          لقد أكدت بريدي
        </Button>
        <Button variant="glass" onClick={handleResend} loading={sending} className="w-full">
          إعادة إرسال الرابط
        </Button>
        <button
          type="button"
          onClick={signOut}
          className="mt-2 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-200"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </CenteredShell>
  );
}
