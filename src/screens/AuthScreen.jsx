import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';
import { authErrorMessage, signInWithEmail, signUpWithEmail } from '../services/auth.js';
import { CenteredShell } from './StatusScreens.jsx';

const MODES = {
  login: { title: 'تسجيل الدخول', submit: 'دخول', switchText: 'ليس لديك حساب؟ إنشاء حساب', next: 'signup' },
  signup: { title: 'إنشاء حساب جديد', submit: 'إنشاء الحساب', switchText: 'لديك حساب بالفعل؟ تسجيل الدخول', next: 'login' },
};

export default function AuthScreen() {
  const { config, notify } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const copy = MODES[mode];

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const email = form.email.trim();
    if (mode === 'signup') {
      const username = form.username.trim();
      if (username.length < 3 || username.length > 20) {
        setError('اسم المستخدم يجب أن يكون بين 3 و 20 حرفاً');
        return;
      }
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail({ username: form.username.trim(), email, password: form.password });
        notify('تم إنشاء الحساب، تحقق من بريدك', 'success');
      } else {
        await signInWithEmail({ email, password: form.password });
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredShell>
      {config.maintenanceMode && (
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-zinc-200">
          التطبيق تحت الصيانة حالياً
        </div>
      )}
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-extrabold text-zinc-50">مجتمع ريسبكت</h1>
        <p className="mt-2 text-sm text-zinc-400">{copy.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <label className="relative block">
            <span className="sr-only">اسم المستخدم</span>
            <User className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <input
              className="field ps-12"
              placeholder="اسم المستخدم"
              value={form.username}
              onChange={update('username')}
              maxLength={20}
              required
            />
          </label>
        )}
        <label className="relative block">
          <span className="sr-only">البريد الإلكتروني</span>
          <Mail className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            type="email"
            dir="ltr"
            className="field text-start ps-12"
            placeholder="البريد الإلكتروني"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            required
          />
        </label>
        <label className="relative block">
          <span className="sr-only">كلمة المرور</span>
          <Lock className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            type="password"
            dir="ltr"
            className="field text-start ps-12"
            placeholder="كلمة المرور"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={form.password}
            onChange={update('password')}
            minLength={6}
            required
          />
        </label>

        {error && <p role="alert" className="text-center text-sm font-semibold text-rose-400">{error}</p>}

        <Button type="submit" loading={loading} className="mt-2 w-full">
          {copy.submit}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(copy.next);
          setError('');
        }}
        className="mt-6 w-full text-center text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
      >
        {copy.switchText}
      </button>
    </CenteredShell>
  );
}
